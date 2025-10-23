import { motion } from "framer-motion";
import { Palette, Settings, Rocket, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Palette,
    title: "Escolha seu Plano",
    description:
      "Selecione o plano ideal para o seu negócio. Tudo transparente e sem taxas ocultas.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Settings,
    title: "Design Personalizado",
    description:
      "Nossa equipe cria um layout exclusivo adaptado à identidade visual da sua marca.",
    color: "from-pink-500 to-orange-500",
  },
  {
    icon: Rocket,
    title: "Loja Pronta",
    description:
      "Em poucos dias, sua loja está configurada e pronta. É só cadastrar produtos e vender.",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: CheckCircle,
    title: "Suporte Contínuo",
    description:
      "Conte com nosso suporte próximo em todas as etapas. Você nunca está sozinho.",
    color: "from-yellow-500 to-green-500",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-32 bg-linear-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um processo simples e rápido para transformar sua ideia em realidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -top-4 -right-4 w-12 h-12 bg-linear-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
