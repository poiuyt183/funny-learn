"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Globe, MessageCircle, ShoppingBag } from "lucide-react";

interface ActivityCardProps {
    title: string;
    description: string;
    icon: string;
    color: "yellow" | "green" | "orange" | "blue";
    href: string;
}

const colorClasses = {
    yellow: {
        gradient: "from-yellow-400 via-amber-400 to-orange-400",
        hoverGradient: "hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500",
        shadow: "shadow-yellow-200/50",
    },
    green: {
        gradient: "from-green-400 via-emerald-400 to-teal-400",
        hoverGradient: "hover:from-green-500 hover:via-emerald-500 hover:to-teal-500",
        shadow: "shadow-green-200/50",
    },
    orange: {
        gradient: "from-orange-400 via-red-400 to-pink-400",
        hoverGradient: "hover:from-orange-500 hover:via-red-500 hover:to-pink-500",
        shadow: "shadow-orange-200/50",
    },
    blue: {
        gradient: "from-blue-400 via-cyan-400 to-sky-400",
        hoverGradient: "hover:from-blue-500 hover:via-cyan-500 hover:to-sky-500",
        shadow: "shadow-blue-200/50",
    },
};

// Map icon string to actual Lucide icon component
const getIcon = (iconStr: string) => {
    const iconMap: Record<string, typeof BookOpen> = {
        "📝": BookOpen,
        "🌍": Globe,
        "💬": MessageCircle,
        "🏪": ShoppingBag,
    };
    return iconMap[iconStr] || BookOpen;
};

export function ActivityCard({ title, description, icon, color, href }: ActivityCardProps) {
    const IconComponent = getIcon(icon);
    const colors = colorClasses[color];

    return (
        <Link href={href} className="group">
            <motion.div
                whileHover={{
                    y: -12,
                }}
                whileTap={{
                    scale: 0.98,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
                className={`
                    relative overflow-hidden
                    bg-gradient-to-br ${colors.gradient} ${colors.hoverGradient}
                    rounded-3xl p-10
                    shadow-2xl ${colors.shadow} hover:shadow-3xl
                    border-4 border-white/60
                    cursor-pointer
                   transition-all duration-300
                    group-hover:border-white/80
                `}
            >
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
                </div>

                <div className="relative flex flex-col items-center text-center space-y-5">
                    {/* Icon with bounce animation */}
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl" />
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/40">
                            <IconComponent className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/95 text-lg font-semibold leading-relaxed max-w-xs">
                        {description}
                    </p>

                    {/* Hover indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}
