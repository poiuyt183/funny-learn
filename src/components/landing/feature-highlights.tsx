"use client"

import { motion } from "framer-motion";
import { BookOpen, Users, Smile } from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Học Qua Phiêu Lưu",
        description: "Mỗi bài học là một cuộc phiêu lưu thú vị",
        detail: "Người bạn đồng hành sẽ dẫn dắt bé khám phá kiến thức qua những câu chuyện và trò chơi hấp dẫn",
        color: "from-coral-400 to-rose-500",
        bgColor: "from-coral-50 to-rose-50",
    },
    {
        icon: Smile,
        title: "Môi Trường An Toàn",
        description: "Nội dung được kiểm duyệt kỹ lưỡng",
        detail: "Hệ thống được thiết kế đặc biệt cho trẻ em, đảm bảo nội dung lành mạnh và phù hợp độ tuổi",
        color: "from-teal-400 to-cyan-500",
        bgColor: "from-teal-50 to-cyan-50",
    },
    {
        icon: Users,
        title: "Theo Dõi Tiến Độ",
        description: "Phụ huynh luôn được cập nhật",
        detail: "Báo cáo chi tiết giúp phụ huynh hiểu rõ quá trình phát triển và điểm mạnh của con",
        color: "from-amber-400 to-yellow-500",
        bgColor: "from-amber-50 to-yellow-50",
    },
];

export function FeatureHighlights() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-heading font-bold text-slate-800 mb-4">
                        Tại Sao Phụ Huynh Yêu Thích?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Ba điều đặc biệt giúp con bạn học tập hiệu quả và vui vẻ
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                whileHover={{ y: -6 }}
                                className="group cursor-pointer"
                            >
                                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${feature.bgColor} p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-white`}>
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-heading font-bold text-slate-800 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg font-semibold text-slate-700 mb-3">
                                        {feature.description}
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.detail}
                                    </p>

                                    {/* Decorative Element - Softer */}
                                    <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full opacity-5 group-hover:scale-125 transition-transform duration-500`}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
