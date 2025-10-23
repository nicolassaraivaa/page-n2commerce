import Contact from "./components/common/Contact";
import Features from "./components/common/Features";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Hero from "./components/common/Hero";
import HowItWorks from "./components/common/HowltWorks";
import Pricing from "./components/common/Pricings";
import Testimonials from "./components/common/Testimonials";

export default function Home() {
  return (
    <div id="inicio" className="overflow-x-hidden">
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
