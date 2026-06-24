import Link from "next/link";
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="flex items-center justify-between h-20">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-teal-400 to-cyan-500 rounded-lg">
                        <i className="ri-shield-check-line text-white text-xl"></i>
                    </div>
                    <span className="text-xl font-bold transition-colors text-white">SecureAccount</span>
                </div>

                {/* Menu Links */}
                <div className="hidden md:flex items-center gap-12">
                    <a href="#features" className="text-base font-medium transition-all duration-300 hover:text-teal-400 cursor-pointer text-white/90">Tính năng</a>
                    <a href="#security" className="text-base font-medium transition-all duration-300 hover:text-teal-400 cursor-pointer text-white/90">Bảo mật</a>
                    <a href="#pricing" className="text-base font-medium transition-all duration-300 hover:text-teal-400 cursor-pointer text-white/90">Giá cả</a>
                    <a href="#support" className="text-base font-medium transition-all duration-300 hover:text-teal-400 cursor-pointer text-white/90">Hỗ trợ</a>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-base font-medium transition-colors whitespace-nowrap cursor-pointer text-white hover:text-teal-300">Đăng nhập</Link>
                    <Link href="/login" className="bg-linear-to-br from-teal-400 to-cyan-500 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/40 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer">Dùng thử Miễn phí</Link>
                </div>
            </div>
        </div>
    </nav>
);
export default Navbar;