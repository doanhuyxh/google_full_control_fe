import { Image } from "antd"

// --- Testimonial Section Component ---
const TestimonialSection = () => (
    <section className="relative bg-[#0A1F44] py-24 lg:py-28 overflow-hidden">
        {/* Background Effect */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Testimonial Image */}
                <div className="lg:col-span-5">
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-teal-400/30">
                            <Image
                                alt="Khách hàng hài lòng"
                                className="w-full h-auto object-cover object-top"
                                src="https://readdy.ai/api/search-image?query=professional%20vietnamese%20business%20person%20portrait%20confident%20smile%20modern%20office%20background%20natural%20lighting%20high%20quality%20professional%20photography%20clean%20simple%20background&amp;width=400&amp;height=500&amp;seq=testimonial-person-001&amp;orientation=portrait"
                            />
                        </div>
                    </div>
                </div>

                {/* Testimonial Content */}
                <div className="lg:col-span-7 lg:pl-8">
                    <i className="ri-double-quotes-l text-5xl text-teal-400/40 mb-6 block"></i>
                    <blockquote className="text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8">
                        SecureAccount đã thay đổi hoàn toàn cách tôi quản lý tài khoản. Giờ đây tôi có thể kiểm soát tất cả chỉ trong một nơi, an toàn và tiện lợi. Đây thực sự là giải pháp tôi đã tìm kiếm từ lâu.
                    </blockquote>
                    <div className="mb-10">
                        <div className="text-xl font-bold text-white mb-2">Nguyễn Minh Tuấn</div>
                        <div className="text-base text-white/70">Giám đốc Công nghệ, TechViet Solutions</div>
                    </div>
                    <button className="bg-linear-to-br from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer">
                        Đọc thêm câu chuyện
                    </button>
                </div>
            </div>
        </div>
    </section>
);

export default TestimonialSection;