"use server";

import { adicionarSubdominio } from "@/services/coolify.service";
import {
  getProvisioning,
  upsertProvisioning,
  type ProvisioningStatus,
} from "@/lib/provisioning-store";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const COOLIFY_BASE_DOMAIN = process.env.COOLIFY_BASE_DOMAIN || "";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "N2Commerce <notificacoes@saraivaa.shop>";

export async function provisionarClienteAsync(
  subdominio: string,
  email?: string | null,
): Promise<void> {
  const key = subdominio.toLowerCase().trim();
  console.log("[Provisionar] Iniciando provisionamento em background:", key);

  try {
    const resultado = await adicionarSubdominio(key);

    if (resultado.success && resultado.url) {
      await upsertProvisioning(key, {
        status: "ativo",
        url: resultado.url,
        provisionado_em: new Date().toISOString(),
        erro_provisionamento: null,
        email: email ?? undefined,
      });
      console.log("[Provisionar] Subdomínio ativo:", resultado.url);
      const record = await getProvisioning(key);
      const emailParaEnvio = email || record?.email;
      if (emailParaEnvio && RESEND_API_KEY) {
        await enviarEmailAmbientePronto(emailParaEnvio, resultado.url, key);
      }
    } else {
      await upsertProvisioning(key, {
        status: "erro_provisionamento",
        erro_provisionamento: resultado.error || "Erro desconhecido",
        email: email ?? undefined,
      });
      console.error("[Provisionar] Erro:", resultado.error);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Provisionar] Exceção:", message);
    await upsertProvisioning(key, {
      status: "erro_provisionamento",
      erro_provisionamento: message,
      email: email ?? undefined,
    });
  }
}

async function enviarEmailAmbientePronto(
  to: string,
  url: string,
  subdominio: string,
): Promise<void> {
  if (!RESEND_API_KEY) return;
  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Seu ambiente N2Commerce está pronto!",
      html: `
        <h2>Seu ambiente está pronto</h2>
        <p>Você já pode acessar sua loja:</p>
        <p><strong><a href="${url}">${url}</a></strong></p>
        <p>Subdomínio: <strong>${subdominio}.${COOLIFY_BASE_DOMAIN}</strong></p>
        <p>Qualquer dúvida, entre em contato com nosso suporte.</p>
      `,
    });
    console.log("[Provisionar] Email enviado para", to);
  } catch (e) {
    console.error("[Provisionar] Falha ao enviar email:", e);
  }
}

/**
 * Retorna status para um cliente (subdomínio).
 */
export async function getStatusProvisionamento(clienteId: string): Promise<{
  status: ProvisioningStatus | null;
  url?: string | null;
  mensagem: string;
}> {
  const record = await getProvisioning(clienteId);
  if (!record) {
    return { status: null, mensagem: "Cliente não encontrado." };
  }
  const mensagens: Record<ProvisioningStatus, string> = {
    provisionando: "Configurando seu ambiente... Isso leva de 2-5 minutos.",
    ativo: "Seu ambiente está pronto! Você já pode acessar.",
    erro_provisionamento: "Houve um problema. Nossa equipe foi notificada.",
  };
  return {
    status: record.status,
    url: record.url,
    mensagem: mensagens[record.status],
  };
}
