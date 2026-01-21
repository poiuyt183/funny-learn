import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { VoiceChatClient } from "./voice-chat-client";

interface PageProps {
    params: Promise<{
        childId: string;
    }>;
}

export default async function VoiceChatPage({ params }: PageProps) {
    const { childId } = await params;

    // Verify session
    const session = await auth.api.getSession({ headers: await headers() });

    // Fetch child profile with mascot
    const child = await prisma.childProfile.findUnique({
        where: { id: childId },
        include: {
            mascot: true,
        },
    });

    if (!child) {
        redirect("/kid-login");
    }

    // Ensure mascot exists
    if (!child.mascot) {
        redirect(`/learn/${childId}`);
    }

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#FDF6F8]">
            <VoiceChatClient
                childId={child.id}
                childName={child.name}
                mascot={{
                    id: child.mascot.id,
                    name: child.mascot.name,
                    imageUrl: child.mascot.imageUrl,
                    baseGreeting: child.mascot.baseGreeting,
                    basePersonality: child.mascot.basePersonality
                }}
            />
        </main>
    );
}
