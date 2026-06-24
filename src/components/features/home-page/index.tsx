import Navbar from "./Navbar"
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeatureCard";
import TestimonialSection from "./TestimonialSection";
import AboutSection from "./AboutSection";
import Footer from "./Footer";


export default function HomePageComponent() {
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

