import { getSubscriptionAnalytics, getSubscriptions, getRecentPayments } from "@/actions/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { DollarSign, TrendingUp, Users, TrendingDown } from "lucide-react";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { ManualUpgradeDialog } from "@/components/admin/manual-upgrade-dialog";

export default async function SubscriptionsPage() {
    const analytics = await getSubscriptionAnalytics();
    const subscriptions = await getSubscriptions({ limit: 20 });
    const recentPayments = await getRecentPayments(10);

    const statCards = [
        {
            title: "Monthly Recurring Revenue",
            value: `$${analytics.mrr.toFixed(2)}`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Active Subscriptions",
            value: analytics.activeSubscriptions,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "New (30 days)",
            value: analytics.newSubscriptions,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            title: "Churn Rate",
            value: `${analytics.churnRate}%`,
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
    ];

    const statusColors: Record<string, string> = {
        ACTIVE: "bg-green-100 text-green-700",
        CANCELED: "bg-red-100 text-red-700",
        EXPIRED: "bg-gray-100 text-gray-700",
        PAST_DUE: "bg-orange-100 text-orange-700",
    };

    const planColors: Record<string, string> = {
        FREE: "bg-slate-100 text-slate-700",
        PREMIUM: "bg-blue-100 text-blue-700",
        FAMILY: "bg-purple-100 text-purple-700",
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-800 font-heading">Subscription Management</h1>
                <p className="text-slate-500 text-lg mt-2">
                    Manage plans, payments, and analytics
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
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Revenue Chart */}
            <Card className="shadow-lg border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">
                        Plan Distribution & Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RevenueChart data={analytics.planDistribution} />
                </CardContent>
            </Card>

            {/* Active Subscriptions Table */}
            <Card className="shadow-lg border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Active Subscriptions</CardTitle>
                    <CardDescription>Most recent subscriptions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-slate-800">{sub.user.name || "No Name"}</div>
                                                <div className="text-sm text-slate-500">{sub.user.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={planColors[sub.plan]}>{sub.plan}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[sub.status]}>{sub.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {sub.endDate ? new Date(sub.endDate).toLocaleDateString("vi-VN") : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-600">{sub.provider}</span>
                                        </TableCell>
                                        <TableCell>
                                            <ManualUpgradeDialog userId={sub.user.id} userName={sub.user.name || sub.user.email} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="shadow-lg border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Recent Payments</CardTitle>
                    <CardDescription>Latest payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div className="font-medium text-slate-800">
                                                {payment.subscription.user.name || payment.subscription.user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-green-700">
                                                ${payment.amount.toFixed(2)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{payment.provider}</TableCell>
                                        <TableCell>
                                            <Badge variant={payment.status === "SUCCESS" ? "default" : "destructive"}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {new Date(payment.createdAt).toLocaleString("vi-VN")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
