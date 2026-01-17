import Link from "next/link";
import { Star, Mail, MapPin, Phone } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-md">
                                <Star className="w-6 h-6 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-heading font-bold">Funny Learn</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Phiêu lưu học tập an toàn và thú vị cho các bé
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Liên Kết</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li><Link href="/sign-up" className="hover:text-coral-400 transition-colors">Đăng Ký</Link></li>
                            <li><Link href="/sign-in" className="hover:text-coral-400 transition-colors">Đăng Nhập</Link></li>
                            <li><Link href="/kid-login" className="hover:text-coral-400 transition-colors">Kid Login</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Hỗ Trợ</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li><Link href="#" className="hover:text-coral-400 transition-colors">Trợ Giúp</Link></li>
                            <li><Link href="#" className="hover:text-coral-400 transition-colors">Câu Hỏi Thường Gặp</Link></li>
                            <li><Link href="#" className="hover:text-coral-400 transition-colors">Liên Hệ</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Liên Hệ</h3>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-coral-400" />
                                <span>support@funnylearn.vn</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-coral-400" />
                                <span>+84 123 456 789</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-coral-400" />
                                <span>Hà Nội, Việt Nam</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Funny Learn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
