"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Sparkles,
    FileText,
    LogOut,
    Crown,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { name: "Mascots", href: "/admin/mascots", icon: Sparkles },
    { name: "AI Content", href: "/admin/ai-content", icon: MessageSquare },
    { name: "System Logs", href: "/admin/logs", icon: FileText },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
            {/* Header */}
            <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
                <Crown className="h-6 w-6 text-amber-400" />
                <h1 className="text-xl font-bold font-heading">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-amber-500 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-700 p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
                    asChild
                >
                    <Link href="/parent/dashboard">
                        <LogOut className="mr-3 h-5 w-5" />
                        Exit Admin
                    </Link>
                </Button>
            </div>
        </div>
    );
}
