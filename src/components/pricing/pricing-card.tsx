"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

export type PlanType = "Explorer" | "Adventurer" | "Hero";

interface PricingCardProps {
    plan: PlanType;
    description: string;
    price: string;
    period: string;
    features: string[];
    popular?: boolean;
    color: "green" | "coral" | "yellow";
    ctaText?: string;
}

const colorMap = {
    green: {
        border: "border-emerald-400",
        bg: "bg-emerald-50",
        button: "bg-emerald-400 hover:bg-emerald-500",
        text: "text-emerald-700",
        icon_bg: "bg-emerald-100",
    },
    coral: {
        border: "border-primary",
        bg: "bg-orange-50",
        button: "bg-primary hover:bg-orange-500",
        text: "text-primary",
        icon_bg: "bg-orange-100",
    },
    yellow: {
        border: "border-yellow-400",
        bg: "bg-yellow-50",
        button: "bg-yellow-400 hover:bg-yellow-500",
        text: "text-yellow-700",
        icon_bg: "bg-yellow-100",
    },
};

export function PricingCard({
    plan,
    description,
    price,
    period,
    features,
    popular = false,
    color,
    ctaText = "Bắt đầu ngay",
}: PricingCardProps) {
    const theme = colorMap[color];

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative bg-white rounded-3xl p-8 border-4 ${theme.border} shadow-xl flex flex-col h-full overflow-hidden`}
        >
            {popular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold px-4 py-1 rounded-bl-xl border-l-2 border-b-2 border-yellow-500 shadow-sm">
                    PHỔ BIẾN NHẤT
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-2xl font-black ${theme.text} mb-2`}>{plan}</h3>
                <p className="text-slate-500 text-sm min-h-[40px]">{description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline">
                    <span className="text-4xl font-black text-slate-800">{price}</span>
                    <span className="text-slate-400 ml-2 font-medium">{period}</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div
                            className={`mt-0.5 min-w-5 min-h-5 rounded-full ${theme.icon_bg} flex items-center justify-center`}
                        >
                            <Check className={`w-3 h-3 ${theme.text} stroke-[4]`} />
                        </div>
                        <span className="text-slate-600 font-medium text-sm">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            <button
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-95 ${theme.button} flex items-center justify-center gap-2 group`}
            >
                {ctaText}
                <Star className="w-5 h-5 fill-white/20 group-hover:rotate-45 transition-transform" />
            </button>
        </motion.div>
    );
}
