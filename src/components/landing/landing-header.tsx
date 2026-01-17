"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-orange-100 shadow-sm"
        >
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-rose-500">
                            Funny Learn
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#features"
                            className="text-slate-700 hover:text-coral-600 font-medium transition-colors"
                        >
                            Về Chúng Tôi
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-slate-700 hover:text-coral-600 font-medium transition-colors"
                        >
                            Gói Dịch Vụ
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4">
                        <Link href="/sign-in">
                            <Button variant="ghost" className="hidden sm:inline-flex hover:text-coral-600">
                                Đăng Nhập
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="bg-gradient-to-r from-rose-300 to-rose-500 hover:from-coral-600 hover:to-rose-600 shadow-md text-white">
                                Dùng Thử Miễn Phí
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}
