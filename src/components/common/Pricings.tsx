import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

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
    name: "Professional",
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
    price: "Personalizado",
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
    <section id="planos" className="py-32 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Planos Transparentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div
                className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 h-full ${
                  plan.popular
                    ? "border-orange-500 scale-105"
                    : "border-gray-200"
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 text-lg">{plan.period}</span>
                </div>

                <Button
                  onClick={scrollToContact}
                  className={`w-full mb-8 py-6 text-lg rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  Começar Agora
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
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
