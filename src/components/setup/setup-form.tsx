"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useEffect } from "react";
import { createEcommerceAction } from "@/actions/create-ecommerce";
import { createUserAndLinkAction } from "@/actions/create-user-and-link";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { PatternFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { fetchCepData } from "@/helpers/cep";

function CreateEcommerceButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Criando loja...
        </>
      ) : (
        "Criar Loja"
      )}
    </button>
  );
}

function CreateUserButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Criando usuário...
        </>
      ) : (
        "Finalizar Configuração"
      )}
    </button>
  );
}

export function SetupForm({
  sessionId,
  customerEmail,
}: {
  sessionId: string;
  customerEmail?: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [ecommerceId, setEcommerceId] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);

  /* @ts-ignore */
  const [createEcommerceState, createEcommerceFormAction] = useActionState(
    createEcommerceAction,
    null
  );
  /* @ts-ignore */
  const [createUserState, createUserFormAction] = useActionState(
    createUserAndLinkAction,
    null
  );

  const [showPassword, setShowPassword] = useState(false);
  const [zipCodeValue, setZipCodeValue] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");

  useEffect(() => {
    if (
      createEcommerceState &&
      "success" in createEcommerceState &&
      createEcommerceState.success &&
      "ecommerceId" in createEcommerceState &&
      createEcommerceState.ecommerceId
    ) {
      setEcommerceId(createEcommerceState.ecommerceId);
      if ("subdomain" in createEcommerceState && createEcommerceState.subdomain) {
        setSubdomain(createEcommerceState.subdomain);
      }
      setStep(2);
    }
  }, [createEcommerceState]);

  useEffect(() => {
    if (
      createUserState &&
      "success" in createUserState &&
      createUserState.success
    ) {
      const sub = "subdomain" in createUserState && createUserState.subdomain
        ? createUserState.subdomain
        : null;
      if (sub) {
        window.location.href = `/provisionando?cliente=${encodeURIComponent(sub)}`;
      } else if ("loginUrl" in createUserState && createUserState.loginUrl) {
        window.location.href = createUserState.loginUrl;
      }
    }
  }, [createUserState]);

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
      } else {
        setStreet("");
        setNeighborhood("");
        setCity("");
        setStateValue("");
      }

      setIsLoadingCep(false);
    }
  };

  if (step === 2 && ecommerceId) {
    return (
      <div className="space-y-4 text-left">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Etapa 2 de 2
            </span>
            <span className="text-xs text-gray-500">Criar Conta</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Loja criada com sucesso!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Agora vamos criar sua conta de administrador.
          </p>
        </div>

        <form action={createUserFormAction} className="space-y-4">
          <input type="hidden" name="ecommerceId" value={ecommerceId} />
          {subdomain && (
            <input type="hidden" name="subdomain" value={subdomain} />
          )}

          <div>
            <label
              htmlFor="adminName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              required
              autoComplete="name"
              placeholder="Seu nome completo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email do Administrador
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={customerEmail}
              required
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Este será o email de acesso ao painel administrativo.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                autoComplete="new-password"
                minLength={6}
                placeholder="******"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Mínimo de 6 caracteres.
            </p>
          </div>

          {createUserState &&
            "error" in createUserState &&
            createUserState.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                ⚠️ {createUserState.error}
              </div>
            )}

          <div className="pt-4">
            <CreateUserButton />
          </div>
        </form>
      </div>
    );
  }

  return (
    <form
      action={createEcommerceFormAction}
      className="space-y-4 text-left"
      autoComplete="off"
    >
      <input type="hidden" name="sessionId" value={sessionId} />

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Etapa 1 de 2
          </span>
          <span className="text-xs text-gray-500">Configuração da Loja</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: "50%" }}
          ></div>
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome da Loja
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="off"
          placeholder="Ex: Minha Loja"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            id="subdomain"
            name="subdomain"
            required
            autoComplete="off"
            pattern="[a-z0-9-]+"
            placeholder="minhaloja"
            className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            .bewear.com
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Apenas letras minúsculas, números e hífens.
        </p>
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
                allowEmptyFormatting
                mask="_"
                value={zipCodeValue}
                onValueChange={(values) => handleCepChange(values.value)}
                customInput={Input}
                placeholder="00000-000"
                disabled={isLoadingCep}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              {isLoadingCep && (
                <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
              )}
            </div>
            <input
              type="hidden"
              name="zipCode"
              value={zipCodeValue.replace(/\D/g, "")}
              required
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
                id="street"
                name="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                autoComplete="street-address"
                placeholder="Nome da rua"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                id="number"
                name="number"
                required
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              id="complement"
              name="complement"
              autoComplete="address-line2"
              placeholder="Apto, Bloco, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              id="neighborhood"
              name="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              placeholder="Nome do bairro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                autoComplete="address-level2"
                placeholder="Nome da cidade"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                id="state"
                name="state"
                value={stateValue}
                onChange={(e) => setStateValue(e.target.value.toUpperCase())}
                required
                autoComplete="address-level1"
                placeholder="UF"
                maxLength={2}
                style={{ textTransform: "uppercase" }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {createEcommerceState &&
        "error" in createEcommerceState &&
        createEcommerceState.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            ⚠️ {createEcommerceState.error}
          </div>
        )}

      <div className="pt-4">
        <CreateEcommerceButton />
      </div>
    </form>
  );
}
