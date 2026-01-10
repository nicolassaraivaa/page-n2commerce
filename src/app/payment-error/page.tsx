import Link from "next/link";

interface PaymentErrorPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentErrorPage({
  searchParams,
}: PaymentErrorPageProps) {
  const params = await searchParams;
  const errorParam = Array.isArray(params?.error)
    ? params.error[0]
    : params?.error;

  const isSessionAlreadyUsed = errorParam === "session_already_used";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isSessionAlreadyUsed
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          >
            {isSessionAlreadyUsed ? (
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
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
            )}
          </div>
        </div>
        {isSessionAlreadyUsed ? (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Sessão já utilizada ⚠️
            </h1>
            <p className="text-gray-600 mb-6">
              Esta sessão de pagamento já foi utilizada para criar um
              e-commerce.
              <br />
              Cada pagamento pode ser usado apenas uma vez.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Ops! Algo deu errado. 😕
            </h1>
            <p className="text-gray-600 mb-6">
              Não conseguimos confirmar o seu pagamento.
              <br />
              Pode ter havido uma falha no cartão ou cancelamento.
            </p>
          </>
        )}

        <div className="space-y-3">
          {!isSessionAlreadyUsed && (
            <Link
              href="/#planos"
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Tentar Novamente
            </Link>
          )}
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
