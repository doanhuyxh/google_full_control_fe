
// --- Feature Card Component ---
interface FeatureCardProps {
    iconClass: string;
    title: string;
    description: string;
}
const FeatureCard = ({ iconClass, title, description }: FeatureCardProps) => (
    <div className="group bg-linear-to-br from-white to-blue-50/30 rounded-2xl p-12 border border-blue-100 shadow-lg hover:shadow-2xl hover:shadow-[#0A1F44]/10 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 cursor-pointer">
        <div className="w-16 h-16 flex items-center justify-center bg-linear-to-br from-teal-400/20 to-cyan-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <i className={iconClass}></i>
        </div>
        <h3 className="text-2xl font-bold text-[#0A1F44] mb-4">{title}</h3>
        <p className="text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
);

// --- Features Section Component ---
const FeaturesSection = () => (
    <section id="features" className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#0A1F44] mb-6">Tại sao chọn chúng tôi?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Chúng tôi mang đến giải pháp quản lý tài khoản toàn diện với công nghệ bảo mật hàng đầu
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                    iconClass="ri-shield-check-line text-4xl text-teal-500"
                    title="Bảo mật Cấp Ngân hàng"
                    description="Mã hóa AES-256 bit và xác thực đa yếu tố đảm bảo dữ liệu của bạn luôn được bảo vệ tuyệt đối. Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế cao nhất."
                />
                <FeatureCard
                    iconClass="ri-flashlight-line text-4xl text-teal-500"
                    title="Quản lý Một chạm"
                    description="Truy cập và quản lý tất cả tài khoản của bạn chỉ với một cú nhấp chuột. Tự động đồng bộ và cập nhật thông tin theo thời gian thực, tiết kiệm thời gian quý báu."
                />
                <FeatureCard
                    iconClass="ri-dashboard-line text-4xl text-teal-500"
                    title="Kiểm soát Toàn diện"
                    description="Theo dõi hoạt động, quản lý quyền truy cập và nhận cảnh báo ngay lập tức. Bạn có toàn quyền kiểm soát mọi khía cạnh của tài khoản với giao diện trực quan."
                />
            </div>
        </div>
    </section>
);
export default FeaturesSection;