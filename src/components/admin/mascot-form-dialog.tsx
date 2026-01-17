"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { mascotSchema, type MascotInput } from "@/lib/validations/mascot";
import { createMascot, updateMascot } from "@/actions/mascot";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2 } from "lucide-react";

interface MascotFormDialogProps {
    mascot?: {
        id: string;
        name: string;
        type: string;
        description: string;
        imageUrl: string;
        basePersonality: string;
        baseGreeting: string;
        traits: string[];
    };
    trigger?: React.ReactNode;
}

export function MascotFormDialog({ mascot, trigger }: MascotFormDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<MascotInput>({
        resolver: zodResolver(mascotSchema),
        defaultValues: {
            name: mascot?.name || "",
            type: mascot?.type || "",
            description: mascot?.description || "",
            imageUrl: mascot?.imageUrl || "",
            basePersonality: mascot?.basePersonality || "",
            baseGreeting: mascot?.baseGreeting || "",
            traits: mascot?.traits.join(", ") || "",
        },
    });

    async function onSubmit(data: MascotInput) {
        setLoading(true);

        const traitsArray = data.traits.split(",").map((t) => t.trim());

        const mascotData = {
            ...data,
            traits: traitsArray,
        };

        const result = mascot
            ? await updateMascot(mascot.id, mascotData)
            : await createMascot(mascotData);

        if (result.success) {
            toast.success(mascot ? "Cập nhật thành công" : "Tạo linh thú thành công");
            setOpen(false);
            form.reset();
            router.refresh();
        } else {
            toast.error(result.error || "Đã xảy ra lỗi");
        }

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-full shadow-clay">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Thêm Linh Thú
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold font-heading">
                        {mascot ? "Chỉnh sửa Linh Thú" : "Thêm Linh Thú Mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {mascot
                            ? "Cập nhật thông tin linh thú"
                            : "Tạo một linh thú mới cho học sinh"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên Linh Thú</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Rồng Vàng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Rồng, Robot, Tiên..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô Tả</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mô tả ngắn về linh thú" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Hình Ảnh</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/mascot.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="basePersonality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tính Cách Mặc Định</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Vui vẻ, Nghiêm túc, Tò mò..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="baseGreeting"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Câu Chào Mặc Định</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="VD: Xin chào! Mình là Rồng Vàng, bạn của bé!"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="traits"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Đặc Điểm (phân cách bởi dấu phẩy)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Dũng cảm, Thông minh, Tốt bụng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mascot ? "Cập Nhật" : "Tạo Linh Thú"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
