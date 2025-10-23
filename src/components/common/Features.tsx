import { motion } from "framer-motion";
import {
  Sparkles,
  DollarSign,
  Headphones,
  Shield,
  Zap,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Personalização Completa",
    description:
      "Layout exclusivo adaptado à identidade visual do seu negócio. Sua marca, sua essência.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Preço Acessível",
    description:
      "Planos transparentes e justos, sem taxas escondidas. Investimento que cabe no seu bolso.",
    gradient: "from-pink-500 to-orange-500",
  },
  {
    icon: Headphones,
    title: "Suporte Próximo",
    description:
      "Nossa equipe está sempre disponível para ajudar em todas as etapas da sua jornada.",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: Shield,
    title: "Seguro e Estável",
    description:
      "Plataforma confiável desenvolvida com tecnologia moderna para garantir desempenho.",
    gradient: "from-yellow-500 to-green-500",
  },
  {
    icon: Zap,
    title: "Rápido e Prático",
    description:
      "Sua loja online pronta em dias, não em meses. Comece a vender rapidamente.",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Zero Complicação",
    description:
      "Não precisa se preocupar com hospedagem ou configurações. Foque apenas em vender.",
    gradient: "from-teal-500 to-blue-500",
  },
];

export default function Features() {
  return (
    <section
      id="diferenciais"
      className="py-32 bg-linear-to-br from-[#1a1f3a] to-[#2d1f4a] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Nossos Diferenciais
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
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
