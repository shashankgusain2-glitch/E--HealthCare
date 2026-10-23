"use client";

import {Navbar} from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import ContactsSection from "@/components/sections/ContactsSection";
import {Footer} from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <HeroSection/>
        <AboutSection/>
        <ServicesSection/>
        {/* <DoctorsSection/> */}
        <ContactsSection/>
      </main>

      <Footer />
    </div>
  );
}
