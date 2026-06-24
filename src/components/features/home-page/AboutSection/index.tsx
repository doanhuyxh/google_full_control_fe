import { Image } from "antd"
// --- About Section Component ---
const AboutSection = () => (
    <section className="bg-white py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
                {/* Image/Team */}
                <div className="lg:col-span-5">
                    <div className="space-y-6">
                        <div className="inline-flex items-center border-2 border-[#0A1F44] rounded-full px-6 py-2.5">
                            <span className="text-sm font-medium text-[#0A1F44]">Về chúng tôi</span>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                alt="Đội ngũ chuyên gia"
                                className="w-full h-auto object-cover object-top"
                                src="https://readdy.ai/api/search-image?query=professional%20tech%20team%20working%20together%20in%20modern%20office%20cybersecurity%20experts%20diverse%20team%20collaboration%20clean%20bright%20workspace%20technology%20company%20atmosphere%20simple%20background&amp;width=500&amp;height=600&amp;seq=about-team-001&amp;orientation=portrait"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-teal-500/10 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-7">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0A1F44] leading-tight mb-7">
                        Đội ngũ chuyên gia <span className="bg-linear-to-br from-teal-400 to-cyan-500 bg-clip-text text-transparent">bảo mật</span> hàng đầu Việt Nam
                    </h2>
                    <div className="space-y-5 mb-9">
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Với hơn 10 năm kinh nghiệm trong lĩnh vực an ninh mạng và bảo mật thông tin, đội ngũ của chúng tôi đã phục vụ hàng nghìn khách hàng doanh nghiệp và cá nhân trên toàn quốc.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Chúng tôi không ngừng nghiên cứu và áp dụng các công nghệ bảo mật tiên tiến nhất để đảm bảo dữ liệu của bạn luôn được bảo vệ an toàn tuyệt đối trong mọi tình huống.
                        </p>
                    </div>
                    <button className="bg-[#0A1F44] text-white px-9 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-linear-to-br hover:from-teal-400 hover:to-cyan-500 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-3 whitespace-nowrap cursor-pointer">
                        Tìm hiểu thêm<i className="ri-arrow-right-line text-teal-300 text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
);
export default AboutSection;