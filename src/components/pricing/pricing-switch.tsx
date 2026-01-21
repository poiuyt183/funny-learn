"use client";

import { motion } from "framer-motion";

interface PricingSwitchProps {
    billingCycle: "monthly" | "yearly";
    setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

export function PricingSwitch({
    billingCycle,
    setBillingCycle,
}: PricingSwitchProps) {
    return (
        <div className="flex items-center justify-center gap-4 mb-10">
            <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`text-lg font-bold transition-colors ${billingCycle === "monthly"
                    ? "text-slate-800"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                Theo tháng
            </button>

            <div
                className="relative w-16 h-8 bg-slate-200 rounded-full cursor-pointer p-1 transition-colors hover:bg-slate-300"
                onClick={() =>
                    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
                }
            >
                <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    layout
                    initial={false}
                    animate={{
                        x: billingCycle === "monthly" ? 0 : 32,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`text-lg font-bold transition-colors ${billingCycle === "yearly"
                        ? "text-slate-800"
                        : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    Theo năm
                </button>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold border border-yellow-200 transform rotate-3 inline-block animate-pulse">
                    Tiết kiệm 20%
                </span>
            </div>
        </div>
    );
}
