// ===========================================
// 1. COMPONENTS TÁCH BIỆT
// ===========================================

import Link from "next/link";

// --- Navbar Component ---
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

// --- Hero Section Component ---
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
              <img
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
              <img
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
              <img
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

// --- Footer Component ---
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
              <img
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

// ===========================================
// 2. MAIN APP COMPONENT
// ===========================================

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 1. Header/Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Features Section */}
      <FeaturesSection />

      {/* 4. Testimonial Section */}
      <TestimonialSection />

      {/* 5. About Us Section */}
      <AboutSection />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}