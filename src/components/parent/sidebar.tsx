"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CreditCard, Settings, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const items = [
    {
        title: "Dashboard",
        url: "/parent/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Children",
        url: "/parent/children", // Placeholder route
        icon: Users,
    },
    {
        title: "Subscription",
        url: "/parent/subscription", // Placeholder
        icon: CreditCard,
    },
    {
        title: "Settings",
        url: "/parent/settings", // Placeholder
        icon: Settings,
    },
]

export function ParentSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in")
                }
            }
        })
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r-4 border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-full bg-primary" />
                <span className="font-heading text-xl font-bold text-slate-800">AI-Land</span>
            </div>

            <nav className="flex-1 space-y-2">
                {items.map((item) => {
                    const isActive = pathname === item.url
                    return (
                        <Link
                            key={item.title}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 font-heading font-semibold transition-all hover:bg-slate-50",
                                isActive
                                    ? "bg-sky-50 text-primary shadow-sm ring-1 ring-sky-100"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto border-t-2 border-slate-50 pt-6">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-heading font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-destructive"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
