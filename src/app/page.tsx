import dynamic from "next/dynamic";
import Header from "@/components/common/Header";
import Hero from "@/components/common/Hero";

const ScrollProgress = dynamic(() =>
  import("@/components/ui/scroll-progress").then((mod) => ({
    default: mod.ScrollProgress,
  })),
);
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
      <div className="content-visibility-auto">
        <HowItWorks />
      </div>
      <div className="content-visibility-auto">
        <Features />
      </div>
      <div className="content-visibility-auto">
        <Pricing />
      </div>
      <div className="content-visibility-auto">
        <Testimonials />
      </div>
      <div className="content-visibility-auto">
        <Contact />
      </div>
      <div className="content-visibility-auto">
        <Footer />
      </div>
    </div>
  );
}
