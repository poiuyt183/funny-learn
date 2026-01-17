"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, BarChart3, ArrowRight } from "lucide-react";
import { useState } from "react";

export function DualEntryPortal() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-heading font-bold text-slate-800 mb-4">
                        Chọn Vai Trò Của Bạn
                    </h2>
                    <p className="text-xl text-slate-600">
                        Hai cổng vào, hai trải nghiệm khác biệt
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Kids Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        onHoverStart={() => setHoveredCard("kids")}
                        onHoverEnd={() => setHoveredCard(null)}
                        className="relative group"
                    >
                        <Link href="/kid-login" className="block">
                            <motion.div
                                whileHover={{ scale: 1.03, y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-1 shadow-2xl cursor-pointer"
                            >
                                <div className="bg-white rounded-[22px] p-8 lg:p-12 h-full">
                                    {/* Mascot Illustration */}
                                    <div className="mb-6">
                                        <motion.div
                                            animate={hoveredCard === "kids" ? {
                                                rotate: [0, -10, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            } : {}}
                                            transition={{ duration: 0.5 }}
                                            className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center text-6xl lg:text-7xl mx-auto shadow-lg"
                                        >
                                            🎮
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="text-3xl lg:text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-4">
                                            Khu Vực Trẻ Em
                                        </h3>
                                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                            Bắt đầu cuộc phiêu lưu học tập cùng linh thú AI của bạn!
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-3 mb-8 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                <span className="text-slate-700">Bài học vui nhộn</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <span className="text-slate-700">Linh thú AI đồng hành</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                                <span className="text-slate-700">Nhận điểm thưởng</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg flex items-center justify-center gap-2 group-hover:shadow-2xl transition-shadow"
                                        >
                                            <Rocket className="w-5 h-5" />
                                            Bắt Đầu Học Ngay
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Parents Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        onHoverStart={() => setHoveredCard("parents")}
                        onHoverEnd={() => setHoveredCard(null)}
                        className="relative group"
                    >
                        <Link href="/sign-in" className="block">
                            <motion.div
                                whileHover={{ scale: 1.03, y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-1 shadow-2xl cursor-pointer"
                            >
                                <div className="bg-white rounded-[22px] p-8 lg:p-12 h-full">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <motion.div
                                            animate={hoveredCard === "parents" ? {
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            } : {}}
                                            transition={{ duration: 0.5 }}
                                            className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-lg"
                                        >
                                            <BarChart3 className="w-12 h-12 lg:w-16 lg:h-16 text-blue-600" />
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="text-3xl lg:text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                                            Góc Phụ Huynh
                                        </h3>
                                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                            Quản lý và theo dõi hành trình phát triển của con
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-3 mb-8 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-slate-700">Báo cáo tiến độ chi tiết</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <span className="text-slate-700">Quản lý nhiều con</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span className="text-slate-700">Nội dung an toàn</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg flex items-center justify-center gap-2 group-hover:shadow-2xl transition-shadow"
                                        >
                                            Quản Lý & Theo Dõi
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
