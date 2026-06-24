import { Image } from "antd"
const Footer = () => (
    <footer className="bg-linear-to-br from-teal-500 via-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20">
            {/* Footer Top */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 pb-16 border-b border-white/20">
                <div className="flex items-center gap-3 mb-6 lg:mb-0">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
                        <i className="ri-shield-check-line text-white text-2xl"></i>
                    </div>
                    <span className="text-2xl font-bold">SecureAccount</span>
                </div>
                <p className="text-base text-white/90">Bảo vệ tài khoản của bạn, mọi lúc mọi nơi</p>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div>
                    <h4 className="text-base font-semibold mb-5">Sản phẩm</h4>
                    <ul className="space-y-3.5">
                        <li><a href="#features" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Tính năng</a></li>
                        <li><a href="#security" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Bảo mật</a></li>
                        <li><a href="#pricing" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Giá cả</a></li>
                        <li><a href="#updates" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Cập nhật</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-base font-semibold mb-5">Công ty</h4>
                    <ul className="space-y-3.5">
                        <li><a href="#about" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Về chúng tôi</a></li>
                        <li><a href="#blog" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Blog</a></li>
                        <li><a href="#careers" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Tuyển dụng</a></li>
                        <li><a href="#contact" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Liên hệ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-base font-semibold mb-5">Hỗ trợ</h4>
                    <ul className="space-y-3.5">
                        <li><a href="#help" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Trung tâm trợ giúp</a></li>
                        <li><a href="#docs" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Tài liệu</a></li>
                        <li><a href="#api" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">API</a></li>
                        <li><a href="#status" className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer">Trạng thái</a></li>
                    </ul>
                </div>
                {/* Social & Copyright */}
                <div className="text-right">
                    <div className="text-lg font-semibold mb-2">© SecureAccount 2025</div>
                    <div className="text-sm text-white/70 mb-5">All rights reserved</div>
                    <div className="flex justify-end gap-4">
                        <a href="#facebook" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"><i className="ri-facebook-fill text-lg"></i></a>
                        <a href="#twitter" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"><i className="ri-twitter-x-line text-lg"></i></a>
                        <a href="#linkedin" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"><i className="ri-linkedin-fill text-lg"></i></a>
                        <a href="#youtube" className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"><i className="ri-youtube-fill text-lg"></i></a>
                    </div>
                </div>
            </div>

            {/* Call to Action (Subscription) */}
            <div className="pt-12 border-t border-white/20">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Mockup Image */}
                    <div className="hidden md:block">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <Image
                                alt="Dashboard mockup"
                                className="w-full h-auto object-cover object-top"
                                src="https://readdy.ai/api/search-image?query=modern%20minimalist%20dashboard%20mockup%20on%20laptop%20screen%20clean%20interface%20teal%20and%20blue%20colors%20professional%20tech%20illustration%20simple%20white%20background&amp;width=280&amp;height=180&amp;seq=footer-mockup-001&amp;orientation=landscape"
                            />
                        </div>
                    </div>
                    {/* Slogan */}
                    <div className="text-center">
                        <div className="text-2xl font-medium leading-snug">Một nền tảng.<br />Vô vàn khả năng.<br />Bảo mật tuyệt đối.</div>
                    </div>
                    {/* Subscription Form */}
                    <div>
                        <p className="text-sm text-white/80 mb-3 leading-relaxed">Đăng ký nhận tin tức và cập nhật mới nhất từ chúng tôi</p>
                        <div className="flex">
                            <input
                                placeholder="Email của bạn"
                                className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-l-full px-6 py-3.5 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors text-sm"
                                type="email"
                            />
                            <button className="bg-white text-teal-600 px-7 rounded-r-full font-semibold transition-all duration-300 hover:bg-white/90 cursor-pointer">
                                <i className="ri-arrow-right-line text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Power By */}
            <div className="mt-12 pt-8 border-t border-white/20 text-center">
                <a href="https://readdy.ai/?origin=logo" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer">Powered by Readdy</a>
            </div>
        </div>
    </footer>
);
export default Footer;