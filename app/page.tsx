import HeroSection from "@/components/landingPage-components/HeroSection"
import HowToStartSection from "@/components/landingPage-components/HowToStartSection"
import FeaturesSection from "@/components/landingPage-components/FeaturesSection"
import SignUpToday from "@/components/landingPage-components/SignUpToday"
import Testimonials from "@/components/landingPage-components/Testimonials"
import Navbar from '@/components/landingPage-components/Navbar';
export default function HomePage() {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex-1">
          <HeroSection />
          <HowToStartSection /> 
          <FeaturesSection />
          <Testimonials />
        </div>
          <SignUpToday />
      </div>

    );
}