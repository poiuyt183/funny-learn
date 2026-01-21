import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { VoiceChatClient } from "./voice-chat-client";
import { LogOut } from "lucide-react";

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

    // Ensure mascot exists (should be handled by onboarding, but checking just in case)
    if (!child.mascot) {
        redirect(`/learn/${childId}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <a
                        href={`/learn/${childId}`}
                        className="
                        flex items-center gap-2 
                        bg-white/80 backdrop-blur-sm 
                        px-4 py-2 rounded-full 
                        border border-purple-100 shadow-sm
                        text-slate-600 hover:text-slate-900 
                        hover:bg-white transition-all
                    "
                    >
                        <LogOut className="w-4 h-4 rotate-180" />
                        <span className="font-bold text-sm">Quay lại</span>
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 h-screen pt-20 pb-4 flex flex-col justify-center">
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
        </div>
    );
}
