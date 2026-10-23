
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";


import ServicesSection from "@/components/sections/ServicesSection"; 

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}