import { getCurrentSubscription } from "@/actions/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Calendar, CheckCircle2 } from "lucide-react";

export async function SubscriptionCard() {
    const subscription = await getCurrentSubscription();

    if (!subscription) {
        return (
            <Card className="shadow-clay border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-amber-500" />
                        <CardTitle className="text-xl font-bold text-slate-800">Your Plan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-600 mb-4">You are currently on the <strong>FREE</strong> plan.</p>
                    <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600">
                        Upgrade to Premium
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const planFeatures = {
        FREE: {
            color: "bg-slate-100 text-slate-700",
            emoji: "🆓",
            features: ["1 child profile", "Basic AI lessons", "Community support"],
        },
        PREMIUM: {
            color: "bg-blue-100 text-blue-700",
            emoji: "⭐",
            features: ["3 child profiles", "Unlimited AI lessons", "Priority support", "Advanced analytics"],
        },
        FAMILY: {
            color: "bg-purple-100 text-purple-700",
            emoji: "👨‍👩‍👧‍👦",
            features: ["3 child profiles", "Unlimited AI lessons", "Priority support", "Family dashboard", "Custom mascots"],
        },
    };

    const currentPlan = planFeatures[subscription.plan];

    return (
        <Card className="shadow-clay border-sky-100">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-amber-500" />
                        <CardTitle className="text-xl font-bold text-slate-800">
                            {currentPlan.emoji} {subscription.plan} Plan
                        </CardTitle>
                    </div>
                    <Badge className={currentPlan.color}>{subscription.status}</Badge>
                </div>
                {subscription.endDate && (
                    <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        Valid until: <strong>{new Date(subscription.endDate).toLocaleDateString("vi-VN")}</strong>
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="text-sm font-bold text-slate-600 uppercase mb-2">Features:</h4>
                    <ul className="space-y-2">
                        {currentPlan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {subscription.plan === "FREE" && (
                    <Button className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600">
                        Upgrade Now
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
