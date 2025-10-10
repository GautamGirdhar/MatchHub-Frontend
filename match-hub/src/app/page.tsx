import Header from "@/components/LandingPage/Header";
import Hero from "@/components/LandingPage/Hero";
import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import { TimelineDemo } from "@/components/LandingPage/HowItWorks";
import { AboutSection } from "@/components/LandingPage/AboutUs";
import { SafetySection } from "@/components/LandingPage/Safety";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <Header />
      <Hero />
      <Features />
      <TimelineDemo />
      <AboutSection />
      <SafetySection />
      <Footer />
    </div>
  );
}
