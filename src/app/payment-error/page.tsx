import Link from "next/link";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado. 😕</h1>
        <p className="text-gray-600 mb-6">
          Não conseguimos confirmar o seu pagamento.
          <br />
          Pode ter havido uma falha no cartão ou cancelamento.
        </p>

        <div className="space-y-3">
          <Link
            href="/#planos"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Tentar Novamente
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
