"use client"

import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface StatBarProps {
    childName: string;
    level: number;
    gold: number;
}

export function StatBar({ childName, level, gold }: StatBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl"
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Greeting */}
                <div className="text-center md:text-left">
                    <motion.h1
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2"
                    >
                        Xin chào, {childName}! 👋
                    </motion.h1>
                    <p className="text-white/95 text-xl font-semibold">
                        Sẵn sàng cho một ngày học tuyệt vời? ✨
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    {/* Level Badge */}
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                            bg-white/25 backdrop-blur-md
                            hover:bg-white/35
                            rounded-2xl px-7 py-4
                            border-3 border-white/60
                            shadow-xl hover:shadow-2xl
                            cursor-pointer
                            transition-all duration-300
                        "
                    >
                        <div className="flex items-center gap-3">
                            <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                            <div className="text-left">
                                <p className="text-white/90 text-sm font-bold uppercase tracking-wider">
                                    Cấp độ
                                </p>
                                <p className="text-white text-3xl font-black">{level}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Gold Counter */}
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                            bg-white/25 backdrop-blur-md
                            hover:bg-white/35
                            rounded-2xl px-7 py-4
                            border-3 border-white/60
                            shadow-xl hover:shadow-2xl
                            cursor-pointer
                            transition-all duration-300
                        "
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{
                                    rotate: [0, 15, -15, 0],
                                    scale: [1, 1.1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Sparkles className="w-10 h-10 text-yellow-200 fill-yellow-200 drop-shadow-lg" />
                            </motion.div>
                            <div className="text-left">
                                <p className="text-white/90 text-sm font-bold uppercase tracking-wider">
                                    Xu vàng
                                </p>
                                <p className="text-white text-3xl font-black">{gold}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
