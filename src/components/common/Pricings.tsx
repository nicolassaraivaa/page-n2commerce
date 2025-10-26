import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { AnimatedShinyText } from "../ui/animated-shiny-text";
import { ShinyButton } from "../ui/shiny-button";

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    description: "Perfeito para quem está começando",
    features: [
      "Layout personalizado",
      "Até 100 produtos",
      "Hospedagem incluída",
      "Certificado SSL",
      "Suporte por email",
      "Painel administrativo",
    ],
    popular: false,
  },
  {
    name: "Profissional",
    price: "R$ 197",
    period: "/mês",
    description: "Para negócios em crescimento",
    features: [
      "Tudo do Starter",
      "Produtos ilimitados",
      "Suporte prioritário",
      "Integração com redes sociais",
      "Relatórios avançados",
      "Múltiplos métodos de pagamento",
      "SEO otimizado",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Personalizar",
    period: "",
    description: "Soluções sob medida",
    features: [
      "Tudo do Professional",
      "Desenvolvimento customizado",
      "Gerente de conta dedicado",
      "Treinamento da equipe",
      "Integrações personalizadas",
      "SLA garantido",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const scrollToContact = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="planos" className="py-32 bg-primary-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-medium text-gray-900 mb-6 tracking-tighter text-white">
            Planos Transparentes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio. Sem taxas ocultas, sem
            surpresas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-7 left-0 right-0 flex justify-center z-1">
                  <div className="bg-linear-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <AnimatedShinyText className="flex items-center gap-2 text-white/80">
                      <Sparkles className="w-4 h-4" />
                      Mais Popular
                    </AnimatedShinyText>
                  </div>
                </div>
              )}

              <div
                className={`bg-transparent rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full ${
                  plan.popular
                    ? "border-2 border-primary-500 shadow-primary/25 scale-105"
                    : "border border-white/25"
                }`}
              >
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tighter">
                  {plan.name}
                </h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-white tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-gray-300 text-lg">{plan.period}</span>
                </div>

                {plan.popular ? (
                  <ShinyButton
                    onClick={scrollToContact}
                    className={`w-full mb-8 py-3 text-lg rounded-xl transition-all duration-300 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30`}
                  >
                    Começar agora
                  </ShinyButton>
                ) : (
                  <Button
                    onClick={scrollToContact}
                    className={`w-full mb-8 py-6 text-lg rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Começar agora
                  </Button>
                )}

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
