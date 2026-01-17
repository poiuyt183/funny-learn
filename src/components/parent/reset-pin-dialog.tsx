"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetKidPin } from "@/actions/kid-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";

const resetPinSchema = z.object({
    newPinCode: z.string()
        .regex(/^\d{4,6}$/, { message: "Mã PIN phải là 4-6 chữ số" }),
    confirmPin: z.string(),
}).refine((data) => data.newPinCode === data.confirmPin, {
    message: "Mã PIN xác nhận không khớp",
    path: ["confirmPin"],
});

type ResetPinInput = z.infer<typeof resetPinSchema>;

interface ResetPinDialogProps {
    childId: string;
    childName: string;
}

export function ResetPinDialog({ childId, childName }: ResetPinDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ResetPinInput>({
        resolver: zodResolver(resetPinSchema),
        defaultValues: {
            newPinCode: "",
            confirmPin: "",
        },
    });

    async function onSubmit(data: ResetPinInput) {
        setLoading(true);

        const result = await resetKidPin({
            childId,
            newPinCode: data.newPinCode,
        });

        if (result.success) {
            toast.success(result.message || "Đã đặt lại mã PIN thành công!");
            setOpen(false);
            form.reset();
            router.refresh();
        } else {
            toast.error(result.error || "Không thể đặt lại mã PIN");
        }

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Đặt Lại PIN
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">
                        Đặt Lại Mã PIN
                    </DialogTitle>
                    <DialogDescription>
                        Tạo mã PIN mới cho <strong>{childName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="newPinCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã PIN Mới (4-6 số)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••"
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác Nhận Mã PIN</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••"
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Đặt Lại PIN
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
