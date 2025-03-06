"use client";
import HeroSection from "@/components/landingPage-components/HeroSection";
import HowToStartSection from "@/components/landingPage-components/HowToStartSection";
import FeaturesSection from "@/components/landingPage-components/FeaturesSection";
import SignUpToday from "@/components/landingPage-components/SignUpToday";
import Testimonials from "@/components/landingPage-components/Testimonials";
import Navbar from "@/components/landingPage-components/Navbar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import Footer from "@/components/landingPage-components/Footer";
export default function HomePage() {
  const viewer = useQuery(api.auth.isAuthenticated);
  if (!viewer) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex-1">
          <HeroSection />
          <HowToStartSection />
          <FeaturesSection />
          <Testimonials />
          <SignUpToday />
        </div>
        <Footer />
      </div>
    );
  } else {
    redirect("/dashboard");
  }
}
