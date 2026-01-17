"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MascotGreetingProps {
    mascotName: string;
    mascotImage: string;
    greeting: string;
    chatLink: string;
}

export function MascotGreeting({ mascotName, mascotImage, greeting, chatLink }: MascotGreetingProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {/* Mascot Image with Floating Animation */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative"
            >
                <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-4 shadow-2xl">
                    <Image
                        src={mascotImage || "/api/placeholder/256/256"}
                        alt={mascotName}
                        width={256}
                        height={256}
                        className="rounded-full object-cover"
                    />
                </div>
            </motion.div>

            {/* Speech Bubble */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative mt-8 bg-white rounded-3xl px-8 py-6 shadow-xl max-w-md"
            >
                {/* Triangle pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white" />

                <p className="text-center text-xl text-slate-700 font-medium leading-relaxed">
                    {greeting || `Xin chào! Mình là ${mascotName}. Sẵn sàng học cùng nhau chưa? 🎉`}
                </p>
            </motion.div>

            {/* Chat Now Button */}
            <Link href={chatLink}>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8"
                >
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-2xl font-bold px-12 py-8 rounded-full shadow-2xl border-4 border-white/50"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <MessageCircle className="w-8 h-8 mr-3" />
                        </motion.div>
                        Trò chuyện ngay!
                    </Button>
                </motion.div>
            </Link>
        </div>
    );
}
