"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

type Status = "provisionando" | "ativo" | "erro_provisionamento" | null;

export function ProvisionandoContent({ clienteId }: { clienteId: string }) {
  const [status, setStatus] = useState<Status>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string>("Carregando...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(
          `/api/provisionamento/status/${encodeURIComponent(clienteId)}`,
        );
        if (cancelled) return;
        const data = await res.json();
        setUrl(data.url ?? null);
        setMensagem(data.mensagem || "Carregando...");
        setStatus(data.status ?? null);
      } catch {
        if (!cancelled) setMensagem("Erro ao consultar status.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    poll();
    const interval = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [clienteId]);

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
      {loading && status === null ? (
        <>
          <div className="mb-6 flex justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-xl font-bold mb-2">Configurando seu ambiente</h1>
          <p className="text-gray-600">{mensagem}</p>
        </>
      ) : status === "provisionando" ? (
        <>
          <div className="mb-6 flex justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-xl font-bold mb-2">Provisionando</h1>
          <p className="text-gray-600">
            Aguarde, estamos configurando sua loja... Isso pode levar alguns
            minutos.
          </p>
        </>
      ) : status === "ativo" && url ? (
        <>
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">Ambiente pronto!</h1>
          <p className="text-gray-600 mb-4">{mensagem}</p>
          <p className="text-sm text-gray-500 mb-4 break-all">{url}</p>
          <div className="flex flex-col gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Acessar minha loja
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Voltar ao site
            </Link>
          </div>
        </>
      ) : status === "erro_provisionamento" ? (
        <>
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">
            Problema no provisionamento
          </h1>
          <p className="text-gray-600 mb-4">{mensagem}</p>
          <Link href="/" className="inline-block text-blue-600 hover:underline">
            Voltar ao início
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">Status</h1>
          <p className="text-gray-600">{mensagem}</p>
        </>
      )}
    </div>
  );
}
