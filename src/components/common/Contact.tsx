"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import dynamic from "next/dynamic";

const BorderBeam = dynamic(
  () => import("../ui/border-beam").then((mod) => mod.BorderBeam),
  { ssr: false }
);

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Dados enviados:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Mensagem enviada com sucesso!");
    }, 1500);
  };

  return (
    <section
      id="contato"
      className="py-32 bg-gray-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-primary-500/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tighter">
            Vamos Começar?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Entre em contato e transforme sua ideia em uma loja online de
            sucesso
          </p>
        </motion.div>

        <div className="flex md:flex-row flex-col gap-12 md:gap-50 items-start md:justify-between justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-400 to-primary-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold tracking-tighter text-lg mb-1">
                    Email
                  </h3>
                  <p className="text-gray-300 ">n2commercee@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-400 to-primary-500 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold tracking-tighter text-lg mb-1">
                    Telefone
                  </h3>
                  <p className="text-gray-300">
                    (11) 98880-4583 ou (14) 99666-1883
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-400 to-primary-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold tracking-tighter text-lg mb-1">
                    Localização
                  </h3>
                  <p className="text-gray-300">São Paulo, Brasil</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden w-full"
          >
            <form
              onSubmit={handleSubmit}
              className="relative w-full overflow-hidden bg-transparent rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10"
            >
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="nome"
                    className="text-gray-300 font-medium text-[16px] tracking-tighter mb-2 block"
                  >
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Seu nome"
                    required
                    className="h-12 rounded-xl border-white/15 text-white focus:border-0 focus-visible:ring-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-300 font-medium text-[16px] tracking-tighter mb-2 block"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="seu@email.com"
                    required
                    className="h-12 rounded-xl border-white/15 text-white focus:border-0 focus-visible:ring-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="telefone"
                    className="text-gray-300 font-medium text-[16px] tracking-tighter mb-2 block"
                  >
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    placeholder="(11) 99999-9999"
                    className="h-12 rounded-xl border-white/15 text-white focus:border-0 focus-visible:ring-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="mensagem"
                    className="text-gray-300 font-medium text-[16px] tracking-tighter mb-2 block"
                  >
                    Mensagem
                  </Label>
                  <Textarea
                    id="mensagem"
                    value={formData.mensagem}
                    onChange={(e) =>
                      setFormData({ ...formData, mensagem: e.target.value })
                    }
                    placeholder="Conte-nos sobre seu projeto..."
                    required
                    className="min-h-32 rounded-xl border-white/15 text-white focus:border-0 focus-visible:ring-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Mensagem
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              <BorderBeam
                duration={8}
                size={150}
                className="from-primary-200 via-primary-500 to-primary-950 opacity-50"
              />
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
