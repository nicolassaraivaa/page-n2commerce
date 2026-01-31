"use client";
import { useState } from "react";
import { m as motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { AnimatedShinyText } from "../ui/animated-shiny-text";
import { ShinyButton } from "../ui/shiny-button";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const handleSubscribe = (priceId?: string) => {
    if (!priceId) return;
    router.push(`/setup?plan=${priceId}`);
  };

  const plans = [
    {
      name: "Starter",
      price: billingCycle === "monthly" ? "R$ 98" : "R$ 900",
      period: billingCycle === "monthly" ? "/mês" : "/ano",
      priceId:
        billingCycle === "monthly"
          ? process.env.NEXT_PUBLIC_PRICE_ID_START
          : process.env.NEXT_PUBLIC_PRICE_ID_START_ANNUAL,
      description: "Perfeito para validar ideias",
      features: [
        "Até 50 produtos",
        "Até 100 pedidos/mês",
        "1 administrador",
        "Subdomínio gratuito",
        "Tema Padrão",
        "Suporte 48h",
        "100 usos mensais da IA",
        "Chatbot limitado (100 usos mensais)",
      ],
      popular: false,
    },
    {
      name: "Profissional",
      price: billingCycle === "monthly" ? "R$ 198" : "R$ 1.822",
      period: billingCycle === "monthly" ? "/mês" : "/ano",
      priceId:
        billingCycle === "monthly"
          ? process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL
          : process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL_ANNUAL,
      description: "Para negócios em crescimento",
      features: [
        "Até 500 produtos",
        "Até 1.000 pedidos/mês",
        "5 administradores",
        "Domínio personalizado",
        "Personalização avançada",
        "Cupons e Promoções",
        "Recuperação de Carrinho",
        "Sem marca d'água",
        "1.000 usos mensais da IA",
        "Chatbot limitado (1.000 usos mensais)",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: billingCycle === "monthly" ? "R$ 498" : "R$ 4.582",
      period: billingCycle === "monthly" ? "/mês" : "/ano",
      priceId:
        billingCycle === "monthly"
          ? process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE
          : process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE_ANNUAL,
      description: "Alta escala e desempenho",
      features: [
        "Tudo do Profissional",
        "Produtos Ilimitados",
        "Pedidos Ilimitados",
        "Admins Ilimitados",
        "Acesso HTML/CSS",
        "Gerente dedicado",
        "API e Integrações",
        "Infraestrutura prioritária",
        "10.000 usos mensais da IA",
        "Chatbot ilimitado",
      ],
      popular: false,
    },
  ];

  return (
    <section id="planos" className="py-32 bg-primary-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-medium mb-6 tracking-tighter text-white">
            Planos Transparentes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Escolha o plano ideal para o seu negócio. Sem taxas ocultas, sem
            surpresas.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "monthly" ? "text-white" : "text-gray-400",
              )}
            >
              Mensal
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className="relative w-14 h-7 bg-primary-900 rounded-full border border-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-950"
              aria-label="Toggle Billing Cycle"
            >
              <div
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-primary-500 rounded-full transition-transform",
                  billingCycle === "yearly" && "translate-x-7",
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "yearly" ? "text-white" : "text-gray-400",
              )}
            >
              Anual{" "}
              <span className="ml-1 text-xs text-primary-400 font-normal">
                (Economize ~8%)
              </span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8 max-w-6xl mx-auto">
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
                className={`bg-transparent rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col ${
                  plan.popular
                    ? "border-2 border-primary-500 shadow-primary/25 scale-105"
                    : "border border-white/25"
                }`}
              >
                <div className="flex-1">
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

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.popular ? (
                  <ShinyButton
                    onClick={() => handleSubscribe(plan.priceId)}
                    className={`w-full py-3 text-lg rounded-xl transition-all duration-300 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 text-center block`}
                  >
                    Assinar agora
                  </ShinyButton>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(plan.priceId)}
                    className={`w-full py-6 text-lg rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Assinar agora
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
