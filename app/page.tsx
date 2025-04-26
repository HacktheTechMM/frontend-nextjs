"use client"
import FAQsThree from "@/components/faqs-3";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import { HeroHeader } from "@/components/hero5-header";
import IntegrationsSection from "@/components/integrations-5";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('USER');
    if (storedUser) {
      router.push('/chats');
    }
  }, []);
  return (
    <>
      <HeroHeader/>
      <HeroSection />
      <Features />
      <IntegrationsSection />
      <FAQsThree /> 
      <FooterSection />
    </>
  );
}
