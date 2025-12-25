"use client";
import HeroSection from "@/src/components/landingPage-components/HeroSection";
import HowToStartSection from "@/src/components/landingPage-components/HowToStartSection";
import FeaturesSection from "@/src/components/landingPage-components/FeaturesSection";
import SignUpToday from "@/src/components/landingPage-components/SignUpToday";
import Testimonials from "@/src/components/landingPage-components/Testimonials";
import Navbar from "@/src/components/landingPage-components/Navbar";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import Footer from "@/src/components/landingPage-components/Footer";
import { useEffect, useState } from "react";
import MoreAboutMe from "@/src/components/landingPage-components/MoreAboutMe";
import PricingSection from "@/src/components/landingPage-components/pricingSection";
import { useQuery } from "@/src/cache/useQuery";

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
