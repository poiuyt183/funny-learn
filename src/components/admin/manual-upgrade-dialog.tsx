"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { manualUpgrade } from "@/actions/subscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

interface ManualUpgradeDialogProps {
    userId: string;
    userName: string;
}

export function ManualUpgradeDialog({ userId, userName }: ManualUpgradeDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        plan: "PREMIUM",
        months: 1,
        reason: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await manualUpgrade({
            userId,
            plan: formData.plan as "PREMIUM" | "FAMILY",
            durationMonths: formData.months,
            reason: formData.reason,
        });

        if (result.success) {
            toast.success("Subscription upgraded successfully");
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to upgrade");
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manual Upgrade</DialogTitle>
                    <DialogDescription>
                        Upgrade subscription for: <strong>{userName}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="plan">Plan</Label>
                        <select
                            id="plan"
                            value={formData.plan}
                            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                            className="w-full rounded-md border border-slate-200 px-3 py-2"
                        >
                            <option value="PREMIUM">Premium ($10/mo)</option>
                            <option value="FAMILY">Family ($15/mo)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="months">Duration (Months)</Label>
                        <Input
                            id="months"
                            type="number"
                            min="1"
                            max="12"
                            value={formData.months}
                            onChange={(e) => setFormData({ ...formData, months: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Input
                            id="reason"
                            placeholder="e.g., Promotional upgrade"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Upgrade Now"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
