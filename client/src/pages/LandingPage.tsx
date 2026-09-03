import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TechStack from "@/components/landing/TechStack";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import Workspace from "@/components/landing/Workspace";
import WhyCodexa from "@/components/landing/WhyCodexa";
import Roadmap from "@/components/landing/Roadmap";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07070B] text-white overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <TechStack />
        <Features />
        <Workflow />
        <Workspace />
        <WhyCodexa />
        <Roadmap />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}