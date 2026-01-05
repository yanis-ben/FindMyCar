import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/sections/HeroSection";
import FeaturesSection from "./components/sections/FeaturesSection";
import StatsSection from "./components/sections/StatsSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import PricingSection from "./components/sections/PricingSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
