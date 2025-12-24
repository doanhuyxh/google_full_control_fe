import { Image } from "antd"

const HeroSection = () => (
    <section className="relative min-h-screen bg-linear-to-br from-[#0A1F44] via-[#1A2F5A] to-[#0A1F44] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 pt-32 pb-20">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Content */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-teal-400/15 border border-teal-400/30 rounded-full px-5 py-2">
                        <i className="ri-lock-line text-teal-400 text-sm"></i>
                        <span className="text-teal-300 font-medium text-sm">Bảo mật cấp ngân hàng</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                        Quản lý toàn bộ <span className="bg-linear-to-br from-teal-400 to-cyan-500 bg-clip-text text-transparent">dịch vụ tài khoản</span> của bạn, dễ dàng và an toàn
                    </h1>
                    <p className="text-xl text-white/75 leading-relaxed max-w-xl">
                        Một nơi duy nhất để theo dõi, cập nhật mật khẩu, và bảo mật mọi tài khoản trực tuyến của bạn.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-5">
                        <button className="bg-linear-to-br from-teal-400 to-cyan-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-teal-400/50 hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap cursor-pointer">
                            Bắt đầu Dùng thử Miễn phí<i className="ri-arrow-right-line text-xl"></i>
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-9 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                            Xem Demo
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-6 text-sm text-white/60">
                        <span className="flex items-center gap-2">
                            <i className="ri-check-line text-teal-400"></i>Không cần thẻ tín dụng
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="flex items-center gap-2">
                            <i className="ri-check-line text-teal-400"></i>Hủy bất cứ lúc nào
                        </span>
                    </div>
                </div>

                {/* Image/Dashboard Mockup */}
                <div className="lg:col-span-7">
                    <div className="relative">
                        <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                            <Image
                                alt="Dashboard quản lý tài khoản"
                                className="w-full h-auto rounded-2xl object-cover object-top"
                                src="https://readdy.ai/api/search-image?query=modern%20minimalist%20account%20management%20dashboard%20interface%20showing%20connected%20apps%20like%20google%20facebook%20amazon%20netflix%20with%20security%20icons%20and%20status%20indicators%20clean%20white%20interface%20with%20teal%20accents%20professional%20tech%20illustration%20simple%20background%20high%20quality%20digital%20design&amp;width=800&amp;height=600&amp;seq=hero-dashboard-001&amp;orientation=landscape"
                            />
                            {/* Floating Icons */}
                            <div className="absolute -top-6 -right-6 w-16 h-16 flex items-center justify-center bg-linear-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg animate-bounce">
                                <i className="ri-shield-check-fill text-white text-2xl"></i>
                            </div>
                            <div
                                className="absolute -bottom-4 -left-4 w-14 h-14 flex items-center justify-center bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg"
                                style={{ animation: "3s ease-in-out 0s infinite normal none running float" }}
                            >
                                <i className="ri-lock-fill text-white text-xl"></i>
                            </div>
                            <div
                                className="absolute top-1/4 -left-8 w-12 h-12 flex items-center justify-center bg-linear-to-br from-teal-300 to-teal-500 rounded-full shadow-lg"
                                style={{ animation: "4s ease-in-out 0s infinite normal none running float" }}
                            >
                                <i className="ri-check-double-line text-white text-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);
export default HeroSection;