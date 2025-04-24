"use client"
import FAQsThree from "@/components/faqs-3";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import IntegrationsSection from "@/components/integrations-5";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <IntegrationsSection />
      <FAQsThree /> 
      <FooterSection />
    </>
  );
}
