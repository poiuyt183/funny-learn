"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorDialog } from "@/components/ui/error-dialog";
import {
    loginSchema,
    registerSchema,
    type LoginInput,
    type RegisterInput
} from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";

interface AuthFormProps {
    type: "login" | "register";
}

const ERROR_MAP: Record<string, string> = {
    "INVALID_EMAIL_OR_PASSWORD": "Email hoặc mật khẩu không chính xác.",
    "USER_ALREADY_EXISTS": "Email này đã được sử dụng.",
    "FAILED_TO_CREATE_USER": "Không thể tạo tài khoản, vui lòng thử lại.",
    "TOO_MANY_REQUESTS": "Quá nhiều yêu cầu, vui lòng thử lại sau.",
};

export function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const [isLoading, setIsLoading] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const schema = type === "login" ? loginSchema : registerSchema;

    const form = useForm<LoginInput | RegisterInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            ...(type === "register" ? { name: "", confirmPassword: "" } : {}),
        },
        mode: "onChange", // Auto clear errors on change
    });

    async function onSubmit(data: LoginInput | RegisterInput) {
        setIsLoading(true);

        try {
            if (type === "login") {
                await authClient.signIn.email({
                    email: data.email,
                    password: data.password,
                }, {
                    onSuccess: async () => {
                        toast.success("Đăng nhập thành công!");

                        // Use router.refresh() to update session state, then navigate
                        router.refresh();

                        // Small delay to ensure session is updated
                        await new Promise(resolve => setTimeout(resolve, 100));

                        // Navigate using Next.js router
                        router.push(callbackUrl || "/parent/dashboard");
                    },
                    onError: (ctx) => {
                        const msg = ERROR_MAP[ctx.error.message?.toUpperCase() || ""] || "Đăng nhập thất bại.";
                        toast.error(msg);

                        // Trigger dialog for specific locking errors if needed
                        if (ctx.error.status === 429) {
                            setErrorMessage(ERROR_MAP["TOO_MANY_REQUESTS"]);
                            setErrorDialogOpen(true);
                        }
                        setIsLoading(false);
                    }
                });
            } else {
                const regData = data as RegisterInput;
                await authClient.signUp.email({
                    email: regData.email,
                    password: regData.password,
                    name: regData.name,
                }, {
                    onSuccess: async () => {
                        toast.success("Tạo tài khoản thành công!");

                        // Refresh session and navigate
                        router.refresh();
                        await new Promise(resolve => setTimeout(resolve, 100));

                        // New users always go to onboarding
                        router.push("/parent/add-child");
                    },
                    onError: (ctx) => {
                        const msg = ERROR_MAP[ctx.error.message?.toUpperCase() || ""] || ctx.error.message || "Đăng ký thất bại.";
                        if (ctx.error.message === "User already exists") { // Better Auth raw message
                            toast.error(ERROR_MAP["USER_ALREADY_EXISTS"]);
                        } else {
                            toast.error(msg);
                        }
                        setIsLoading(false);
                    }
                });
            }
        } catch {
            setErrorMessage("Lỗi kết nối. Vui lòng kiểm tra mạng.");
            setErrorDialogOpen(true);
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {type === "register" && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên hiển thị</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nguyễn Văn A" {...field} className="rounded-full shadow-sm" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} className="rounded-full shadow-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} className="rounded-full shadow-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {type === "register" && (
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} className="rounded-full shadow-sm" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <Button
                        type="submit"
                        className="w-full rounded-full shadow-clay bg-primary hover:bg-primary/90 text-lg font-bold h-12"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {type === "login" ? "Đăng Nhập" : "Đăng Ký"}
                    </Button>
                </form>
            </Form>

            <ErrorDialog
                open={errorDialogOpen}
                onOpenChange={setErrorDialogOpen}
                description={errorMessage}
            />
        </div>
    );
}
