import { Suspense } from "react";

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <Suspense fallback={<div>Carregando...</div>}>
        <SetupContent />
      </Suspense>
    </div>
  );
}

// Separate component to use useSearchParams (requires Suspense boundary)
import { redirect } from "next/navigation";
import Image from "next/image";

function SetupContent() {
  // We will implement the session verification logic here later.
  // For now, just a visual placeholder.
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado! 🎉</h1>
      <p className="text-gray-600 mb-6">
        Sua assinatura foi ativada com sucesso.
        <br />
        Agora vamos configurar sua loja.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-left">
        <p className="text-sm text-blue-800 font-medium">Próximos passos:</p>
        <ul className="text-sm text-blue-600 list-disc list-inside mt-2 space-y-1">
          <li>Escolher o nome da loja</li>
          <li>Definir seu subdomínio</li>
          <li>Criar usuário administrativo</li>
        </ul>
      </div>

      <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
        Continuar Configuração
      </button>
    </div>
  );
}
