import dynamic from "next/dynamic";
import Header from "@/components/common/Header";
import Hero from "@/components/common/Hero";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Contact = dynamic(() => import("@/components/common/Contact"));
const Features = dynamic(() => import("@/components/common/Features"));
const Footer = dynamic(() => import("@/components/common/Footer"));
const HowItWorks = dynamic(() => import("@/components/common/HowltWorks"));
const Pricing = dynamic(() => import("@/components/common/Pricings"));
const Testimonials = dynamic(() => import("@/components/common/Testimonials"));

export default function Home() {
  return (
    <div id="inicio" className="relative overflow-x-hidden">
      <ScrollProgress />
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
