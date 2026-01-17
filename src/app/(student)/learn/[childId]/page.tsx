import { getStudentDashboard } from "@/actions/student-actions";
import { StatBar } from "@/components/student/stat-bar";
import { MascotGreeting } from "@/components/student/mascot-greeting";
import { ActivityCard } from "@/components/student/activity-card";
import { redirect } from "next/navigation";
import { LogOut, Trophy, Target } from "lucide-react";

export default async function StudentDashboardPage({
    params,
}: {
    params: Promise<{ childId: string }>;
}) {
    const { childId } = await params;
    const result = await getStudentDashboard(childId);

    if ("error" in result) {
        redirect("/kid-login");
    }

    const { child, mascot, activities } = result;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Decorative background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
            </div>

            {/* Main Container */}
            <div className="relative">
                {/* Top Navigation Bar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo/Brand */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-800">Funny Learn</h1>
                                    <p className="text-xs text-slate-500">Học vui mỗi ngày</p>
                                </div>
                            </div>

                            {/* Exit Button */}
                            <a
                                href="/kid-login"
                                className="
                                    inline-flex items-center gap-2
                                    bg-slate-100 hover:bg-slate-200
                                    rounded-xl
                                    px-4 py-2
                                    text-slate-700 hover:text-slate-900
                                    font-medium text-sm
                                    cursor-pointer
                                    transition-all duration-200
                                    group
                                "
                            >
                                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                <span className="hidden sm:inline">Thoát</span>
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Welcome Section with Stats */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Welcome Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                                <div className="relative">
                                    <h2 className="text-4xl font-black text-white mb-2">
                                        Chào {child.name}! 👋
                                    </h2>
                                    <p className="text-white/95 text-xl font-semibold mb-6">
                                        Sẵn sàng khám phá điều mới hôm nay?
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="flex gap-4 flex-wrap">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-white/40">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-5 h-5 text-white" />
                                                <div>
                                                    <p className="text-white/80 text-xs font-bold">Cấp độ</p>
                                                    <p className="text-white text-2xl font-black">{child.level}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-white/40">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-yellow-200" />
                                                <div>
                                                    <p className="text-white/80 text-xs font-bold">Xu vàng</p>
                                                    <p className="text-white text-2xl font-black">{child.gold}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mascot Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100">
                            {mascot && (
                                <div className="text-center space-y-4">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full p-3">
                                            <img
                                                src={mascot.imageUrl || "/api/placeholder/128/128"}
                                                alt={mascot.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{mascot.name}</h3>
                                        <p className="text-sm text-slate-600">Người bạn của bạn</p>
                                    </div>
                                    <a
                                        href={`/learn/${childId}/chat`}
                                        className="
                                            inline-flex items-center justify-center
                                            w-full
                                            bg-gradient-to-r from-purple-500 to-pink-500
                                            hover:from-purple-600 hover:to-pink-600
                                            text-white font-bold
                                            rounded-2xl
                                            px-6 py-3
                                            cursor-pointer
                                            transition-all duration-200
                                            shadow-lg hover:shadow-xl
                                        "
                                    >
                                        💬 Trò chuyện ngay
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div>
                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-slate-800 mb-2">
                                Hoạt động hôm nay
                            </h2>
                            <p className="text-slate-600 text-lg">
                                Chọn một hoạt động để bắt đầu học! 🚀
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    title={activity.title}
                                    description={activity.description}
                                    icon={activity.icon}
                                    color={activity.color as "yellow" | "green" | "orange" | "blue"}
                                    href={activity.href}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Mascot Greeting (if available) - Moved to bottom */}
                    {mascot && mascot.baseGreeting && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-100 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full p-2">
                                        <img
                                            src={mascot.imageUrl || "/api/placeholder/64/64"}
                                            alt={mascot.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-purple-600 mb-1">{mascot.name} nói:</p>
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        {mascot.baseGreeting}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-16 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-sm text-slate-500">
                            <p>© 2024 Funny Learn. Học vui, học giỏi! 🎓</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
