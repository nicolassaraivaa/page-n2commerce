"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Particles = dynamic(
  () => import("../ui/particles").then((mod) => mod.Particles),
  { ssr: false }
);
import { AuroraText } from "../ui/aurora-text";
import { Safari } from "../ui/safari";
import { ShineBorder } from "../ui/shine-border";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#0b0d18] via-[#0b0518] to-[#0e101f]">
      <Particles className="absolute inset-0 z-0 max-sm:hidden" />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-200/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto md:mb-50 px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-medium text-primary-50 mb-6 md:leading-18 leading-14 tracking-tighter text-balance"
        >
          Sua loja virtual
          <br />
          <AuroraText
            colors={["#8ac4ff", "#53a4ff", "#2b7eff", "#155dfc"]}
            className="font-medium"
          >
            pronta em dias
          </AuroraText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Plataforma SaaS que simplifica o acesso ao comércio digital.
          <br />
          <span className="text-white font-medium">
            Layout personalizado, estrutura completa, zero complicação.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <InteractiveHoverButton
            className="text-white"
            onClick={scrollToContact}
          >
            Comece agora
          </InteractiveHoverButton>

          <Button
            size="lg"
            variant="link"
            onClick={() =>
              document
                .getElementById("como-funciona")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="backdrop-blur-sm text-white hover:text-white px-8 py-6 text-[16px] rounded-full transition-all duration-300"
          >
            Como Funciona
          </Button>
        </motion.div>
      </div>
      <motion.div className="absolute rounded-xl shadow-2xl shadow-primary-500/50 md:-bottom-[55%] md:w-[1200px] max-sm:hidden z-20">
        <ShineBorder
          shineColor={["#308af1", "#00d9ff"]}
          className="scale-y-102% scale-x-101"
        />
        <Safari url="sualoja.com.br" imageSrc="/bewear.png" mode="simple" />
      </motion.div>
      <div className="absolute bottom-0 left-0 bg-linear-to-b to-100% to-gray-950 w-screen h-60 z-21"></div>
    </section>
  );
}
