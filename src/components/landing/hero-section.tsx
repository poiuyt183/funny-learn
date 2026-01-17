"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Shield, Star, Book, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 lg:py-28 pb-32">
            {/* Animated Background Elements - Softer, Organic Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        y: [-10, 10, -10],
                    }}
                    transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        y: [10, -10, 10],
                    }}
                    transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                    className="absolute bottom-32 right-16 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [-5, 5, -5],
                    }}
                    transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
                    className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-200/25 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Top Section - Centered */}
                    <div className="text-center mb-16">
                        {/* Animated Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md border-2 border-coral-200/50 mb-8"
                        >
                            <Star className="w-5 h-5 text-rose-300 fill-rose-500" />
                            <span className="text-sm font-bold text-slate-700">
                                Học Cùng Bạn Nhỏ - Vui & An Toàn
                            </span>
                        </motion.div>

                        {/* Main Headline - Warmer, More Playful */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl lg:text-7xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-pink-500 leading-tight mb-6"
                        >
                            Phiêu Lưu Học Tập
                            <br />
                            Cùng Những Người Bạn Đặc Biệt
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-xl lg:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed"
                        >
                            Mỗi em sẽ có <span className="font-bold text-coral-600">người bạn đồng hành</span> riêng,{" "}
                            <span className="font-bold text-teal-600">khám phá kiến thức</span> qua những{" "}
                            <span className="font-bold text-amber-600">cuộc phiêu lưu</span> thú vị!
                        </motion.p>

                        {/* Value Icons - New Colors & Icons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap justify-center gap-8 mb-12"
                        >
                            <div className="flex items-center gap-2 text-slate-700">
                                <div className="p-2 bg-coral-100 rounded-full">
                                    <Book className="w-5 h-5 text-coral-600" />
                                </div>
                                <span className="font-semibold">Học Tập Vui</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <div className="p-2 bg-pink-100 rounded-full">
                                    <Heart className="w-5 h-5 text-pink-600" />
                                </div>
                                <span className="font-semibold">Thân Thiện</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <div className="p-2 bg-teal-100 rounded-full">
                                    <Shield className="w-5 h-5 text-teal-600" />
                                </div>
                                <span className="font-semibold">An Toàn</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Role Selection Cards - Softer, Warmer Design */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Kids Card - Coral/Peach Theme */}
                            <motion.div
                                onHoverStart={() => setHoveredCard("kids")}
                                onHoverEnd={() => setHoveredCard(null)}
                                className="relative group"
                            >
                                <Link href="/kid-login" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -6 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-300 via-rose-400 to-pink-400 p-1 shadow-xl cursor-pointer"
                                    >
                                        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-[22px] p-8 lg:p-10 h-full">
                                            <div className="mb-6">
                                                <motion.div
                                                    animate={hoveredCard === "kids" ? {
                                                        rotate: [0, -8, 8, -8, 0],
                                                        y: [0, -5, 0]
                                                    } : {}}
                                                    transition={{ duration: 0.6 }}
                                                    className="w-20 h-20 bg-gradient-to-br from-coral-100 to-rose-100 rounded-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white"
                                                >
                                                    <Users className="w-10 h-10 text-coral-600" />
                                                </motion.div>
                                            </div>

                                            <div className="text-center">
                                                <h3 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-coral-600 to-rose-600 mb-3">
                                                    Khu Vực Các Bé
                                                </h3>
                                                <p className="text-base text-slate-700 mb-6 leading-relaxed">
                                                    Bắt đầu phiêu lưu học tập cùng người bạn đồng hành!
                                                </p>

                                                <motion.div
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="bg-gradient-to-r from-rose-300 to-rose-500 text-white font-bold text-lg py-3 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2"
                                                >
                                                    <Star className="w-5 h-5 fill-white" />
                                                    Bắt Đầu Phiêu Lưu
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>

                            {/* Parents Card - Mint/Teal Theme */}
                            <motion.div
                                onHoverStart={() => setHoveredCard("parents")}
                                onHoverEnd={() => setHoveredCard(null)}
                                className="relative group"
                            >
                                <Link href="/sign-in" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -6 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-400 via-cyan-400 to-sky-400 p-1 shadow-xl cursor-pointer"
                                    >
                                        <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-sky-50 rounded-[22px] p-8 lg:p-10 h-full">
                                            <div className="mb-6">
                                                <motion.div
                                                    animate={hoveredCard === "parents" ? {
                                                        scale: [1, 1.08, 1],
                                                        rotate: [0, 3, -3, 0]
                                                    } : {}}
                                                    transition={{ duration: 0.6 }}
                                                    className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white"
                                                >
                                                    <Heart className="w-10 h-10 text-teal-600" />
                                                </motion.div>
                                            </div>

                                            <div className="text-center">
                                                <h3 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-3">
                                                    Dành Cho Phụ Huynh
                                                </h3>
                                                <p className="text-base text-slate-700 mb-6 leading-relaxed">
                                                    Theo dõi hành trình khám phá của con yêu
                                                </p>

                                                <motion.div
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 text-white font-bold text-lg py-3 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2"
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
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
