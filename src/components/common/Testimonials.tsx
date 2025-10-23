import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

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
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-32 bg-linear-to-br from-purple-50 to-orange-50"
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
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Histórias reais de empreendedores que transformaram seus negócios
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-purple-200" />

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-purple-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.business}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
