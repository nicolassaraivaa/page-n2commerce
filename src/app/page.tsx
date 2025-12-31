import Contact from "@/components/common/Contact";
import Features from "@/components/common/Features";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Hero from "@/components/common/Hero";
import HowItWorks from "@/components/common/HowltWorks";
import Pricing from "@/components/common/Pricings";
import Testimonials from "@/components/common/Testimonials";
import { ScrollProgress } from "@/components/ui/scroll-progress";

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
