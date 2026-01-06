"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { createTenantAction } from "@/actions/onboarding";
import { Loader2, Eye, EyeOff } from "lucide-react";

function SubmitButton() {
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
          Criando sua loja...
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
  /* @ts-ignore */
  const [state, formAction] = useActionState(createTenantAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={formAction}
      className="space-y-4 text-left"
      autoComplete="off"
    >
      <input type="hidden" name="sessionId" value={sessionId} />

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
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          Este email foi vinculado ao seu pagamento.
        </p>
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

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Senha de Administrador
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
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
          Esta senha será usada para acessar o painel administrativo.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          ⚠️ {state.error}
        </div>
      )}

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
