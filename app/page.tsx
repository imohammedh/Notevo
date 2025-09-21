"use client";
import HeroSection from "@/components/landingPage-components/HeroSection";
import HowToStartSection from "@/components/landingPage-components/HowToStartSection";
import FeaturesSection from "@/components/landingPage-components/FeaturesSection";
import SignUpToday from "@/components/landingPage-components/SignUpToday";
import Testimonials from "@/components/landingPage-components/Testimonials";
import Navbar from "@/components/landingPage-components/Navbar";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import Footer from "@/components/landingPage-components/Footer";
import { useEffect, useState } from "react";
import MoreAboutMe from "@/components/landingPage-components/MoreAboutMe";
import PricingSection from "@/components/landingPage-components/pricingSection";
import { useQuery } from "convex-helpers/react/cache";
export default function HomePage() {
  const viewer = useQuery(api.auth.isAuthenticated);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!viewer) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex-1">
          <HeroSection />
          <HowToStartSection />
          <FeaturesSection />
          <MoreAboutMe />
          {/* <Testimonials /> */}
          {/* <PricingSection /> */}
          <SignUpToday />
        </div>
        {isClient && <Footer />}
      </div>
    );
  } else {
    redirect("/dashboard");
  }
}
