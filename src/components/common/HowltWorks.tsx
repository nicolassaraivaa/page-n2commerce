import { motion } from "framer-motion";
import { Palette, Settings, Rocket, CheckCircle } from "lucide-react";
import { Highlighter } from "../ui/highlighter";
import { BentoCard, BentoGrid } from "../ui/bento-grid";

const steps = [
  {
    icon: Settings,
    title: "Escolha seu Plano",
    description:
      "Selecione o plano ideal para o seu negócio. Tudo transparente e sem taxas ocultas.",
    color: "from-purple-500 to-pink-500",
    img: "/plan.png",
  },
  {
    icon: Palette,
    title: "Design Personalizado",
    description:
      "Nossa equipe cria um layout exclusivo adaptado à identidade visual da sua marca.",
    color: "from-pink-500 to-orange-500",
    img: "/plan.png",
  },
  {
    icon: Rocket,
    title: "Loja Pronta",
    description:
      "Em poucos dias, sua loja está configurada e pronta. É só cadastrar produtos e vender.",
    color: "from-orange-500 to-yellow-500",
    img: "/plan.png",
  },
  {
    icon: CheckCircle,
    title: "Suporte Contínuo",
    description:
      "Conte com nosso suporte próximo em todas as etapas. Você nunca está sozinho.",
    color: "from-yellow-500 to-green-500",
    img: "/plan.png",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="relative text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6">
            Como{" "}
            <Highlighter action="highlight" color="#155efc1c">
              Funciona
            </Highlighter>
            ?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Um processo simples e rápido para transformar sua ideia em realidade
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <BentoGrid key={index}>
              <BentoCard
                description={step.description}
                name={step.title}
                Icon={step.icon}
                background={
                  <div className="w-full h-full -z-10">
                    <img src={step.img} className="w-full h-full"></img>
                  </div>
                }
                className="lg:-mb-5"
                href=""
                cta="Contate-nos"
              />
            </BentoGrid>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
