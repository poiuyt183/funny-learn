"use client";

import { useState } from "react";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { PricingSwitch } from "@/components/pricing/pricing-switch";
import { PricingCard } from "@/components/pricing/pricing-card";
import { PricingFAQ } from "@/components/pricing/pricing-faq";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
        "monthly"
    );

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            <LandingHeader />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16 space-y-4">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm tracking-wide uppercase mb-2">
                            Gói Cao Cấp
                        </span>
                        <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-800 mb-6">
                            Chọn Hành Trình <span className="text-primary">Cho Bé!</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            Mở khóa kho tàng kiến thức, sáng tạo và niềm vui. Không quảng cáo,
                            chỉ có niềm vui học tập bất tận.
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <PricingSwitch
                        billingCycle={billingCycle}
                        setBillingCycle={setBillingCycle}
                    />

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <PricingCard
                            plan="Nhà Thám Hiểm"
                            description="Khởi đầu hoàn hảo cho hành trình khám phá."
                            price="0đ"
                            period="/ trọn đời"
                            color="green"
                            features={[
                                "3 bài học miễn phí mỗi ngày",
                                "Bộ tranh tô màu cơ bản",
                                "1 Hồ sơ bé",
                                "An toàn & Không quảng cáo",
                            ]}
                            ctaText="Dùng thử miễn phí"
                        />

                        {/* Monthly Plan */}
                        <PricingCard
                            plan="Phiêu Lưu Ký"
                            description="Vui học thả ga, thanh toán linh hoạt."
                            price={billingCycle === "monthly" ? "129.000đ" : "109.000đ"}
                            period="/ tháng"
                            color="coral"
                            popular={true}
                            features={[
                                "Không giới hạn bài học & truyện",
                                "Trò chuyện giọng nói không giới hạn",
                                "Bảng theo dõi tiến độ chi tiết",
                                "3 Hồ sơ bé",
                                "Chế độ học Offline",
                                "Hỗ trợ ưu tiên 24/7",
                            ]}
                            ctaText="Bắt đầu gói Tháng"
                        />

                        {/* Yearly Plan */}
                        <PricingCard
                            plan="Siêu Anh Hùng"
                            description="Tiết kiệm nhất, quyền lợi tối đa."
                            price={
                                billingCycle === "monthly" ? "1.290.000đ" : "1.090.000đ"
                            }
                            period="/ năm"
                            color="yellow"
                            features={[
                                "Tất cả quyền lợi gói Phiêu Lưu",
                                "Tặng 2 tháng miễn phí",
                                "Huy hiệu 'Siêu Anh Hùng' độc quyền",
                                "Trải nghiệm tính năng mới sớm nhất",
                                "Kho tài liệu VIP cho ba mẹ",
                                "5 Hồ sơ bé",
                            ]}
                            ctaText="Trở thành Anh Hùng"
                        />
                    </div>

                    {/* Trust Section */}
                    <div className="mt-24 text-center">
                        <div className="inline-flex items-center gap-2 text-slate-400 font-bold tracking-widest uppercase text-sm mb-8">
                            Được tin dùng bởi hơn 10.000 gia đình hạnh phúc
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Mock Logos - Replace with real SVGs or Images */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="h-8 w-24 bg-slate-300 rounded animate-pulse"
                                />
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <PricingFAQ />
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
