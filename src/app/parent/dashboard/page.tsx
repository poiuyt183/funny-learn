import { getSubscriptionStatus, getChildProfiles } from "@/actions/parent";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChildCardActions } from "@/components/parent/child-card-actions";
import { AddChildGate } from "@/components/parent/add-child-gate";
import { KidAccountDialog } from "@/components/parent/kid-account-dialog";
import { ResetPinDialog } from "@/components/parent/reset-pin-dialog";
import { Crown, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ParentDashboard() {
    const plan = await getSubscriptionStatus();
    const children = await getChildProfiles();

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-slate-800">
                        Parent Dashboard 🏡
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Manage your family&apos;s learning adventure.
                    </p>
                </div>

                {/* Add Child Gate (Popup Logic) */}
                <AddChildGate childrenCount={children.length} plan={plan || "FREE"} />
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-clay border-sky-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xl font-bold text-slate-700">
                            Current Plan
                        </CardTitle>
                        <Crown className="h-6 w-6 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{plan}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {plan === "FREE" ? "Up to 1 child profile" : "Unlimited profiles"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-clay border-sky-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xl font-bold text-slate-700">
                            Total Explorers
                        </CardTitle>
                        <User className="h-6 w-6 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-secondary">{children.length}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Active learners
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Children List */}
            <div>
                <h2 className="text-2xl font-heading font-bold text-slate-800 mb-6">
                    My Children
                </h2>

                {children.length === 0 ? (
                    <Card className="border-dashed border-4 border-slate-200 shadow-none bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                                <AlertCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-600 mb-2">No profiles yet</h3>
                            <p className="text-slate-400 max-w-sm mx-auto mb-6">
                                Add your first child profile to start tracking their progress and unlocking fun lessons.
                            </p>
                            {/* Gate also here for empty state */}
                            <AddChildGate childrenCount={0} plan={plan || "FREE"} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map((child) => (
                            <Card key={child.id} className="shadow-clay hover:scale-[1.02] transition-transform">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center text-3xl">
                                        {child.mascotId === 'brave_bear' ? '🐻' : child.mascotId === 'smart_owl' ? '🦉' : '🐱'}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-800">{child.name}</CardTitle>
                                        <CardDescription>{child.age} years old</CardDescription>
                                    </div>
                                    <div className="ml-auto">
                                        <Badge variant="secondary" className="rounded-full px-3">{child.points} pts</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-50 rounded-xl p-4 mb-2">
                                        <p className="text-sm font-bold text-slate-500 uppercase text-xs mb-2">Personality</p>
                                        <div className="flex flex-wrap gap-1">
                                            {child.personality.map(t => (
                                                <span key={t} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Kid Login Info */}
                                    {child.username ? (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                            <p className="text-sm font-bold text-green-700 uppercase text-xs mb-2">
                                                🎮 Thông Tin Đăng Nhập
                                            </p>
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-700">
                                                    <span className="font-semibold">Username:</span> {child.username}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Bé có thể tự đăng nhập tại /kid-login
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                            <p className="text-sm text-amber-700 mb-2">
                                                ⚠️ Chưa thiết lập tài khoản đăng nhập cho bé
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions: Kid Account + Edit / Delete */}
                                    <div className="flex gap-2">
                                        {child.username ? (
                                            <ResetPinDialog childId={child.id} childName={child.name} />
                                        ) : (
                                            <KidAccountDialog childId={child.id} childName={child.name} />
                                        )}
                                        <ChildCardActions childId={child.id} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
