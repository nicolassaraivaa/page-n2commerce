"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { initiateCheckoutAction } from "@/actions/initiate-checkout";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  Store,
  User,
} from "lucide-react";
import { PatternFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { fetchCepData } from "@/helpers/cep";

function SubmitButton({ step }: { step: 1 | 2 }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${
        step === 1
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {step === 1 ? "Processando..." : "Redirecionando para Pagamento..."}
        </>
      ) : (
        <>
          {step === 1 ? "Prosseguir" : "Ir para Pagamento"}
          {step === 1 && <ChevronRight className="ml-2 w-4 h-4" />}
        </>
      )}
    </button>
  );
}

export function SetupForm({ priceId }: { priceId: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  /* @ts-ignore */
  const [state, formAction] = useActionState(initiateCheckoutAction, null);

  // Address State
  const [zipCodeValue, setZipCodeValue] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");

  const [storeData, setStoreData] = useState({
    name: "",
    subdomain: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleCepChange = async (value: string) => {
    const cleanZipCode = value.replace(/\D/g, "");
    setZipCodeValue(value);

    if (cleanZipCode.length === 8) {
      setIsLoadingCep(true);
      const cepData = await fetchCepData(cleanZipCode);

      if (cepData) {
        setStreet(cepData.logradouro || "");
        setNeighborhood(cepData.bairro || "");
        setCity(cepData.localidade || "");
        setStateValue(cepData.uf || "");
      }
      setIsLoadingCep(false);
    }
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for Step 1 could be added here
    setStep(2);
  };

  return (
    <form
      action={formAction}
      className="space-y-6 text-left"
      autoComplete="off"
    >
      <input type="hidden" name="priceId" value={priceId} />

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex flex-col items-center flex-1 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 1 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
            >
              <Store className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Dados da Loja</span>
          </div>

          <div className="w-full h-0.5 bg-gray-200 relative flex-1 mx-2">
            <div
              className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 ${step === 2 ? "w-full" : "w-0"}`}
            ></div>
          </div>

          <div
            className={`flex flex-col items-center flex-1 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 2 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
            >
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Administrador</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Store Info */}
      <div className={step === 1 ? "block space-y-4" : "hidden"}>
        <div>
          <label
            htmlFor="storeName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome da Loja
          </label>
          <input
            type="text"
            name="storeName"
            id="storeName"
            required={step === 1}
            value={storeData.name}
            onChange={(e) =>
              setStoreData({ ...storeData, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Minha Loja Inc."
          />
        </div>

        <div>
          <label
            htmlFor="subdomain"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subdomínio
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              name="subdomain"
              id="subdomain"
              required={step === 1}
              pattern="[a-z0-9-]+"
              value={storeData.subdomain}
              onChange={(e) =>
                setStoreData({ ...storeData, subdomain: e.target.value })
              }
              className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="minhaloja"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              .n2commerce.com.br
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefone / WhatsApp
            </label>
            <PatternFormat
              format="(##) #####-####"
              mask="_"
              allowEmptyFormatting
              customInput={Input}
              name="contactPhone"
              id="contactPhone"
              required={step === 1}
              value={storeData.contactPhone}
              onValueChange={(v) =>
                setStoreData({ ...storeData, contactPhone: v.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email de Contato
            </label>
            <input
              type="email"
              name="contactEmail"
              id="contactEmail"
              required={step === 1}
              value={storeData.contactEmail}
              onChange={(e) =>
                setStoreData({ ...storeData, contactEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="contato@loja.com"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Endereço da Loja
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CEP
              </label>
              <div className="relative">
                <PatternFormat
                  format="#####-###"
                  mask="_"
                  allowEmptyFormatting
                  customInput={Input}
                  value={zipCodeValue}
                  onValueChange={(v) => handleCepChange(v.value)}
                  disabled={isLoadingCep}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {isLoadingCep && (
                  <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>
              <input
                type="hidden"
                name="zipCode"
                value={zipCodeValue.replace(/\D/g, "")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rua
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  required={step === 1}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número
                </label>
                <input
                  type="text"
                  name="number"
                  id="number"
                  required={step === 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="complement"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Complemento <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="text"
                name="complement"
                id="complement"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="neighborhood"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bairro
              </label>
              <input
                type="text"
                name="neighborhood"
                id="neighborhood"
                required={step === 1}
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required={step === 1}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required={step === 1}
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={nextStep}
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            Prosseguir <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STEP 2: Admin Info */}
      <div className={step === 2 ? "block space-y-4" : "hidden"}>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 mb-6">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Dados da Loja salvos
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {storeData.name} ({storeData.subdomain}.n2commerce.com.br)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="ml-auto text-xs text-blue-700 hover:underline"
          >
            Editar
          </button>
        </div>

        <div>
          <label
            htmlFor="adminName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome Completo
          </label>
          <input
            type="text"
            name="adminName"
            id="adminName"
            required={step === 2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nome do Admin"
          />
        </div>

        <div>
          <label
            htmlFor="adminCpf"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            CPF
          </label>
          <PatternFormat
            format="###.###.###-##"
            mask="_"
            name="adminCpf"
            id="adminCpf"
            required={step === 2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="adminEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email (Login)
          </label>
          <input
            type="email"
            name="adminEmail"
            id="adminEmail"
            required={step === 2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="admin@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="adminPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="adminPassword"
              id="adminPassword"
              required={step === 2}
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {state && state.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            ⚠️ {state.error}
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
          >
            Voltar
          </button>
          <SubmitButton step={2} />
        </div>
      </div>
    </form>
  );
}
