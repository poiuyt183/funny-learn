import { getAdminStats, getUserGrowthStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, DollarSign, TrendingUp } from "lucide-react";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";

export default async function AdminOverview() {
    const stats = await getAdminStats();
    const growthData = await getUserGrowthStats();

    const statCards = [
        {
            title: "Total Parents",
            value: stats.totalParents,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: GraduationCap,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Monthly Revenue",
            value: `$${stats.monthlyRevenue}`,
            icon: DollarSign,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
        },
        {
            title: "Conversion Rate",
            value: `${stats.conversionRate}%`,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-800 font-heading">Dashboard Overview</h1>
                <p className="text-slate-500 text-lg mt-2">
                    System metrics and performance indicators
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="shadow-lg border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                                {stat.title === "Monthly Revenue" && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        {stats.paidSubscriptions} paid subscriptions
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* User Growth Chart */}
            <Card className="shadow-lg border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">
                        User Growth (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UserGrowthChart data={growthData} />
                </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Total Child Profiles:</span>
                            <span className="font-bold text-slate-800">{stats.totalChildren}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Active Subscriptions:</span>
                            <span className="font-bold text-slate-800">{stats.paidSubscriptions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Free Plan Users:</span>
                            <span className="font-bold text-slate-800">
                                {stats.totalParents - stats.paidSubscriptions}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-700 font-medium">All systems operational</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            Database and API services are running smoothly.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
