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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createKidAccount } from "@/actions/kid-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";

const kidAccountSchema = z.object({
    username: z.string()
        .min(4, { message: "Tên đăng nhập phải có ít nhất 4 ký tự" })
        .max(20, { message: "Tên đăng nhập không quá 20 ký tự" })
        .regex(/^[a-z0-9_]+$/, { message: "Chỉ được dùng chữ thường, số và dấu gạch dưới" }),
    pinCode: z.string()
        .regex(/^\d{4,6}$/, { message: "Mã PIN phải là 4-6 chữ số" }),
    confirmPin: z.string(),
}).refine((data) => data.pinCode === data.confirmPin, {
    message: "Mã PIN xác nhận không khớp",
    path: ["confirmPin"],
});

type KidAccountInput = z.infer<typeof kidAccountSchema>;

interface KidAccountDialogProps {
    childId: string;
    childName: string;
}

export function KidAccountDialog({ childId, childName }: KidAccountDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<KidAccountInput>({
        resolver: zodResolver(kidAccountSchema),
        defaultValues: {
            username: "",
            pinCode: "",
            confirmPin: "",
        },
    });

    async function onSubmit(data: KidAccountInput) {
        setLoading(true);

        const result = await createKidAccount({
            childId,
            username: data.username,
            pinCode: data.pinCode,
        });

        if (result.success) {
            toast.success(`Đã tạo tài khoản cho ${childName}!`, {
                description: `Tên đăng nhập: ${data.username}`,
            });
            setOpen(false);
            form.reset();
            router.refresh();
        } else {
            toast.error(result.error || "Không thể tạo tài khoản");
        }

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tạo Tài Khoản Kid
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">
                        Tạo Tài Khoản Đăng Nhập
                    </DialogTitle>
                    <DialogDescription>
                        Thiết lập tên đăng nhập và mã PIN cho <strong>{childName}</strong> để bé có thể tự đăng nhập
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên Đăng Nhập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="VD: nam2024"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Chỉ dùng chữ thường, số và dấu gạch dưới (_)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pinCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã PIN (4-6 số)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••"
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Mã PIN để bé đăng nhập (dễ nhớ cho bé)
                                    </FormDescription>
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
                                Tạo Tài Khoản
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
