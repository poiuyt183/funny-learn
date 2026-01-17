'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Prisma, Role } from "@prisma/client";

/**
 * Verify if user is ADMIN (throws error if not)
 */
async function verifyAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    return session;
}

/**
 * Get Admin Dashboard Stats
 */
export async function getAdminStats() {
    await verifyAdmin();

    const [totalParents, totalStudents, totalChildren, subscriptions] = await Promise.all([
        prisma.user.count({ where: { role: "PARENT" } }),
        prisma.childProfile.count(), // Students are child profiles, not separate user accounts
        prisma.childProfile.count(),
        prisma.subscription.findMany({
            where: { isActive: true },
            select: { plan: true },
        }),
    ]);

    // Calculate revenue (simplified: Premium = $10/month, Family = $15/month)
    const PRICING = { FREE: 0, PREMIUM: 10, FAMILY: 15 };
    const monthlyRevenue = subscriptions.reduce((sum, sub) => sum + PRICING[sub.plan], 0);

    // Conversion rate (Premium/Family vs Total Parents)
    const paidUsers = subscriptions.filter(s => s.plan !== "FREE").length;
    const conversionRate = totalParents > 0 ? ((paidUsers / totalParents) * 100).toFixed(1) : "0";

    return {
        totalParents,
        totalStudents,
        totalChildren,
        monthlyRevenue,
        conversionRate: parseFloat(conversionRate),
        paidSubscriptions: paidUsers,
    };
}

/**
 * Get All Users with Pagination and Filtering
 */
export async function getAllUsers(filters?: {
    role?: Role;
    search?: string;
}) {
    await verifyAdmin();

    const where: Prisma.UserWhereInput = {};

    if (filters?.role) {
        where.role = filters.role;
    }

    if (filters?.search) {
        where.OR = [
            { email: { contains: filters.search, mode: 'insensitive' } },
            { name: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    const users = await prisma.user.findMany({
        where,
        include: {
            subscription: true,
            children: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100, // Limit for performance
    });

    return users;
}

/**
 * Update User Role
 */
export async function updateUserRole(userId: string, newRole: Role) {
    await verifyAdmin();

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { error: "Failed to update user role" };
    }
}

/**
 * Delete User (Admin only)
 */
export async function deleteUser(userId: string) {
    await verifyAdmin();

    try {
        await prisma.user.delete({
            where: { id: userId },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { error: "Failed to delete user" };
    }
}

/**
 * Get User Growth Stats (for chart)
 */
export async function getUserGrowthStats() {
    await verifyAdmin();

    // Get user sign-ups and child profiles for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [parents, children] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: "PARENT",
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                createdAt: true,
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.childProfile.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                createdAt: true,
            },
            orderBy: { createdAt: "asc" },
        }),
    ]);

    // Group by day
    const dayMap: Record<string, { date: string; parents: number; students: number }> = {};

    // Count parents
    parents.forEach(parent => {
        const dateKey = parent.createdAt.toISOString().split('T')[0];
        if (!dayMap[dateKey]) {
            dayMap[dateKey] = { date: dateKey, parents: 0, students: 0 };
        }
        dayMap[dateKey].parents++;
    });

    // Count students (child profiles)
    children.forEach(child => {
        const dateKey = child.createdAt.toISOString().split('T')[0];
        if (!dayMap[dateKey]) {
            dayMap[dateKey] = { date: dateKey, parents: 0, students: 0 };
        }
        dayMap[dateKey].students++;
    });

    return Object.values(dayMap);
}
