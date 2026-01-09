"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Início", id: "inicio" },
  { name: "Como Funciona", id: "como-funciona" },
  { name: "Diferenciais", id: "diferenciais" },
  { name: "Planos", id: "planos" },
  { name: "Depoimentos", id: "depoimentos" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);

          // Detectar seção ativa
          const sections = navItems.map((item) =>
            document.getElementById(item.id)
          );
          const scrollPosition = window.scrollY + 100;

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && section.offsetTop <= scrollPosition) {
              setActiveSection(navItems[i].id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 80; // altura do header fixo
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 max-w-7xl mx-auto my-2 rounded-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1a1f3a]/50 backdrop-blur-lg shadow-lg border border-white/5"
            : "bg-transparent border border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("inicio")}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-primary-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white font-bold tracking-tighter">
                N2
              </div>
              <span className="text-xl font-semibold text-white tracking-tighter">
                Commerce
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden lg:block">
              <Button
                onClick={() => scrollToSection("contato")}
                className="tracking-tighter bg-linear-to-r from-primary-500 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-6 shadow-lg shadow-primary-500/20 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Começar Agora
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-25 left-0 right-0 mx-4 rounded-3xl z-40 lg:hidden bg-[#1a1f3a]/50 backdrop-blur-lg shadow-lg border border-white/5"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection("contato")}
                  className=" mt-4 tracking-tighter bg-linear-to-r from-primary-500 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-6 shadow-lg shadow-primary-500/20 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Começar Agora
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay quando menu mobile está aberto */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
