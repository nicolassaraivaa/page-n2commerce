"use client";
import { m as motion } from "framer-motion";
import {
  Sparkles,
  DollarSign,
  Headphones,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { Highlighter } from "../ui/highlighter";

const features = [
  {
    icon: Sparkles,
    title: "Personalização Completa",
    description:
      "Layout exclusivo adaptado à identidade visual do seu negócio. Sua marca, sua essência.",
    gradient: "from-primary-700 to-primary-500",
  },
  {
    icon: DollarSign,
    title: "Preço Acessível",
    description:
      "Planos transparentes e justos, sem taxas escondidas. Investimento que cabe no seu bolso.",
    gradient: "from-primary-500 to-primary-700",
  },
  {
    icon: Headphones,
    title: "Suporte Próximo",
    description:
      "Nossa equipe está sempre disponível para ajudar em todas as etapas da sua jornada.",
    gradient: "from-primary-500 to-primary-800",
  },
  {
    icon: Shield,
    title: "Seguro e Estável",
    description:
      "Plataforma confiável desenvolvida com tecnologia moderna para garantir desempenho.",
    gradient: "from-primary-100 to-primary-400",
  },
  {
    icon: Zap,
    title: "Rápido e Prático",
    description:
      "Sua loja online pronta em dias, não em meses. Comece a vender rapidamente.",
    gradient: "from-primary-200 to-primary-500",
  },
  {
    icon: Users,
    title: "Zero Complicação",
    description:
      "Não precisa se preocupar com hospedagem ou configurações. Foque apenas em vender.",
    gradient: "from-primary-300 to-primary-600",
  },
];

export default function Features() {
  return (
    <section
      id="diferenciais"
      className="py-32 bg-linear-to-b from-gray-950 to-primary-950 relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl z-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="relative text-4xl md:text-6xl font-medium text-white mb-6 tracking-tighter">
            Nossos{" "}
            <Highlighter action="underline" color="#155efc6c">
              Diferenciais
            </Highlighter>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Por que a N2Commerce é a escolha certa para o seu negócio digital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 m-auto overflow-hidden relative group h-full z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[5em] -right-[2.5em] rounded-full bg-primary/10 group-hover:scale-[1300%] duration-400 z-[-1] op" />
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tighter">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
