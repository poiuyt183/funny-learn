"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getStudentDashboard(childId: string) {
    const session = await auth.api.getSession({ headers: await headers() });

    try {
        const child = await prisma.childProfile.findUnique({
            where: { id: childId },
            include: {
                mascot: true,
                parent: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!child) {
            return { error: "Child profile not found" };
        }

        // If there's a session, verify it's the parent
        if (session && session.user.role === "PARENT") {
            if (child.parent.id !== session.user.id) {
                return { error: "Unauthorized" };
            }
        }
        // Otherwise, allow access (student accessed via kid-login)

        // Calculate level from points (every 100 points = 1 level)
        const level = Math.floor(child.points / 100) + 1;

        // Get available activities based on child's points
        const activities = [
            {
                id: "practice",
                title: "Giải Bài Tập",
                description: "Luyện tập kiến thức mới",
                icon: "📝",
                color: "yellow",
                href: `/learn/${childId}/practice`,
                available: true,
            },
            {
                id: "explore",
                title: "Khám Phá Thế Giới",
                description: "Học qua câu chuyện vui",
                icon: "🌍",
                color: "green",
                href: `/learn/${childId}/explore`,
                available: true,
            },
            {
                id: "chat",
                title: "Trò Chuyện",
                description: `Chat với ${child.mascot?.name || "bạn"}`,
                icon: "💬",
                color: "blue",
                href: `/learn/${childId}/chat`,
                available: true,
            },
            {
                id: "store",
                title: "Cửa Hàng",
                description: "Đổi xu mua đồ chơi",
                icon: "🏪",
                color: "orange",
                href: `/learn/${childId}/store`,
                available: child.points >= 10, // Need at least 10 points
            },
        ];

        return {
            child: {
                id: child.id,
                name: child.name,
                age: child.age,
                level: level,
                gold: child.points, // Using points as "gold"
            },
            mascot: child.mascot,
            activities: activities.filter((a) => a.available),
        };
    } catch (error) {
        console.error("Get Student Dashboard error:", error);
        return { error: "Failed to fetch dashboard data" };
    }
}
