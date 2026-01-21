"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                className="w-full py-5 text-left flex items-center justify-between group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-bold text-slate-700 group-hover:text-primary transition-colors">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-slate-500 leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function PricingFAQ() {
    const faqs = [
        {
            question: "Funny Learn có an toàn cho bé không?",
            answer:
                "Tuyệt đối an toàn! Chúng tôi tuân thủ hoàn toàn quy định COPPA và không có quảng cáo. Nội dung được chọn lọc kỹ lưỡng bởi các chuyên gia giáo dục để đảm bảo phù hợp với lứa tuổi.",
        },
        {
            question: "Tôi có thể hủy đăng ký bất cứ lúc nào không?",
            answer:
                "Có, bạn có thể hủy bất cứ lúc nào trong phần cài đặt tài khoản. Bạn vẫn có thể truy cập đầy đủ tính năng cho đến hết chu kỳ thanh toán hiện tại.",
        },
        {
            question: "Tôi có thể sử dụng trên bao nhiêu thiết bị?",
            answer:
                "Tài khoản của bạn hoạt động trên mọi thiết bị (iOS, Android, Web). Chỉ cần đăng nhập để đồng bộ tiến độ học tập ở bất cứ đâu.",
        },
        {
            question: "Có bản dùng thử miễn phí không?",
            answer:
                "Có chứ! Các gói 'Nhà Thám Hiểm' và 'Siêu Anh Hùng' đều đi kèm 7 ngày dùng thử miễn phí để bạn trải nghiệm toàn bộ tính năng trước khi thanh toán.",
        },
    ];

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-20">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">
                    Câu hỏi thường gặp
                </h2>
                <p className="text-slate-500">
                    Mọi điều ba mẹ cần biết về an toàn và thanh toán.
                </p>
            </div>
            <div>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} {...faq} />
                ))}
            </div>
        </div>
    );
}
