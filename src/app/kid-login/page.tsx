"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAsChild } from "@/actions/kid-auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function KidLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || pin.length < 4) {
            toast.error("Vui lòng nhập tên đăng nhập và mã PIN!");
            return;
        }

        setIsLoading(true);

        const result = await loginAsChild({
            username,
            pinCode: pin,
        });

        if (result.success && result.child) {
            toast.success(`Chào mừng ${result.child.name}! 🎉`);

            // Store childId in localStorage for learning session
            localStorage.setItem("kidSession", JSON.stringify({
                childId: result.child.id,
                name: result.child.name,
            }));

            // Auto-redirect to Student Dashboard
            router.push(`/learn/${result.child.id}`);
        } else {
            toast.error(result.error || "Đăng nhập thất bại");
            setPin(""); // Clear PIN on error
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md shadow-2xl border-4 border-white">
                    <CardHeader className="text-center space-y-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
                        >
                            <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>

                        <CardTitle className="text-4xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Xin Chào Bạn Nhỏ!
                        </CardTitle>
                        <CardDescription className="text-lg text-slate-600">
                            Nhập tên đăng nhập và mã PIN để bắt đầu học
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-lg font-bold text-slate-700">
                                Tên Đăng Nhập
                            </Label>
                            <Input
                                id="username"
                                placeholder="VD: nam2024"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                className="text-lg h-14 text-center font-bold rounded-2xl shadow-inner"
                                autoComplete="off"
                            />
                        </div>

                        {/* PIN Input */}
                        <div className="space-y-2">
                            <Label className="text-lg font-bold text-slate-700">
                                Mã PIN (4 số)
                            </Label>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={4}
                                    value={pin}
                                    onChange={(value) => setPin(value)}
                                    onComplete={() => {
                                        // Auto-submit when PIN is complete
                                        if (username) {
                                            handleLogin();
                                        }
                                    }}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} className="w-16 h-16 text-3xl font-bold rounded-2xl shadow-clay" />
                                        <InputOTPSlot index={1} className="w-16 h-16 text-3xl font-bold rounded-2xl shadow-clay" />
                                        <InputOTPSlot index={2} className="w-16 h-16 text-3xl font-bold rounded-2xl shadow-clay" />
                                        <InputOTPSlot index={3} className="w-16 h-16 text-3xl font-bold rounded-2xl shadow-clay" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        {/* Login Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={handleLogin}
                                disabled={isLoading || !username || pin.length < 4}
                                className="w-full h-16 text-2xl font-bold rounded-2xl shadow-clay bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                            >
                                {isLoading ? (
                                    "Đang đăng nhập..."
                                ) : (
                                    <>
                                        Bắt Đầu Học <ArrowRight className="ml-2 h-6 w-6" />
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        {/* Back to Parent Link */}
                        <div className="text-center pt-4">
                            <button
                                onClick={() => router.push("/")}
                                className="text-slate-500 hover:text-primary text-sm font-medium"
                            >
                                Quay lại trang chủ
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
