import LandingLayout from "../components/layout/LandingLayout";
import HeroSection from "../components/sections/HeroSection";
import FeatureSection from "../components/sections/FeatureSection";
import TestimonialSection from "../components/sections/TestimonialSection";
import CTASection from "../components/sections/CTASection";
import Footer from "../components/sections/Footer";

function LandingPage() {
  return (
    <LandingLayout>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </LandingLayout>
  );
}

export default LandingPage;


