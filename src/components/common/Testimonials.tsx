"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Highlighter } from "../ui/highlighter";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "../ui/scroll-based-velocity";

const testimonials = [
  {
    name: "Maria Silva",
    business: "Moda Bella",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    text: "A N2Commerce transformou meu sonho em realidade. Em menos de uma semana, minha loja estava no ar e já estava vendendo. O suporte é excepcional!",
    rating: 5,
  },
  {
    name: "João Santos",
    business: "Tech Store",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    text: "Plataforma perfeita! Layout personalizado, preço justo e suporte sempre disponível. Não preciso me preocupar com nada técnico, só com minhas vendas.",
    rating: 5,
  },
  {
    name: "Ana Oliveira",
    business: "Sabor Natural",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    text: "Melhor decisão que tomei! A equipe da N2Commerce é incrível, o processo é super rápido e o resultado superou todas as minhas expectativas.",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    business: "Casa & Decoração",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    text: "Incrível como a N2Commerce facilitou tudo! Minha loja online ficou linda e as vendas aumentaram 300% no primeiro mês.",
    rating: 5,
  },
  {
    name: "Fernanda Costa",
    business: "Beleza & Estética",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    text: "Profissionais excepcionais! Me ajudaram desde o design até a configuração dos pagamentos. Recomendo de olhos fechados!",
    rating: 5,
  },
  {
    name: "Roberto Lima",
    business: "Esportes & Fitness",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    text: "A melhor plataforma para e-commerce! Interface intuitiva, suporte 24/7 e resultados que superam todas as expectativas.",
    rating: 5,
  },
  {
    name: "Patricia Souza",
    business: "Artesanato & Criativo",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    text: "Transformaram minha paixão em negócio lucrativo! A plataforma é perfeita para mostrar meus produtos de forma profissional.",
    rating: 5,
  },
  {
    name: "Marcos Alves",
    business: "Eletrônicos & Tech",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    text: "Solução completa para e-commerce! Desde a criação até o marketing digital, a N2Commerce cuida de tudo com excelência.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="min-h-screen pb-50 py-20 bg-linear-to-b from-primary-950 to-gray-950 from-85%"
    >
      <div className="max-w-7xl mx-auto md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl max-md:px-6 md:text-6xl font-medium text-white mb-6 tracking-tighter">
            O Que Nossos Clientes Dizem?
          </h2>
          <p className="relative max-md:px-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Histórias reais de empreendedores que{" "}
            <Highlighter color="#2e70ff5c" action="underline">
              transformaram seus negócios
            </Highlighter>
          </p>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center">
          <ScrollVelocityContainer className="w-full">
            <ScrollVelocityRow baseVelocity={2} direction={1}>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mx-4"
                >
                  <div className="max-w-lg bg-white/5 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-white/10 relative">
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-primary-200" />

                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                      />
                      <div>
                        <h4 className="font-bold text-white text-lg tracking-tighter">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {testimonial.business}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-primary-400 text-primary-400"
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </ScrollVelocityRow>

            <ScrollVelocityRow
              baseVelocity={3}
              direction={-1}
              className="mt-6 relative"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mx-4"
                >
                  <div className="max-w-lg bg-white/5 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-white/10 relative">
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-primary-200" />

                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                      />
                      <div>
                        <h4 className="font-bold text-white text-lg tracking-tighter">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {testimonial.business}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-primary-400 text-primary-400"
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>

          <div className="from-primary-950 pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
          <div className="from-primary-950 pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
        </div>
      </div>
    </section>
  );
}
