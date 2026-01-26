/**
 * Serviço de integração com a API do Coolify para provisionamento de subdomínios.
 * Documentação: https://coolify.io/docs/api-reference
 */

const COOLIFY_URL = process.env.COOLIFY_URL?.replace(/\/$/, "") || "";
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN || "";
const COOLIFY_APP_UUID = process.env.COOLIFY_APP_UUID || "";
const COOLIFY_BASE_DOMAIN = process.env.COOLIFY_BASE_DOMAIN || "";

const POLL_INTERVAL_MS = 10_000;
const DEPLOYMENT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos

export type AdicionarSubdominioResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export type ApplicationStatus = string;

async function coolifyFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${COOLIFY_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(`Coolify API respondeu com conteúdo inválido: ${text?.slice(0, 200)}`);
  }

  if (!res.ok) {
    const errMsg = (data as { message?: string })?.message || res.statusText || text?.slice(0, 200);
    throw new Error(`Coolify API ${res.status}: ${errMsg}`);
  }
  return data;
}

/**
 * Retorna os detalhes da aplicação no Coolify.
 */
export async function getApplication(): Promise<{
  uuid?: string;
  name?: string;
  fqdn?: string;
  status?: ApplicationStatus;
  [key: string]: unknown;
}> {
  if (!COOLIFY_APP_UUID || !COOLIFY_API_TOKEN || !COOLIFY_URL) {
    throw new Error(
      "Variáveis COOLIFY_URL, COOLIFY_API_TOKEN e COOLIFY_APP_UUID são obrigatórias."
    );
  }
  console.log("[Coolify] getApplication: buscando aplicação", COOLIFY_APP_UUID);
  const data = await coolifyFetch<{ uuid?: string; name?: string; fqdn?: string; status?: string; [key: string]: unknown }>(
    `/api/v1/applications/${COOLIFY_APP_UUID}`
  );
  console.log("[Coolify] getApplication: fqdn atual", data.fqdn);
  return data;
}

/**
 * Retorna o status atual do deployment da aplicação.
 */
export async function verificarStatusDeployment(): Promise<ApplicationStatus> {
  const app = await getApplication();
  const status = app.status ?? "unknown";
  console.log("[Coolify] verificarStatusDeployment:", status);
  return status;
}

/**
 * Faz polling até o status da aplicação ser 'running' ou timeout.
 */
export async function aguardarDeployment(): Promise<boolean> {
  const start = Date.now();
  console.log("[Coolify] aguardarDeployment: iniciando polling a cada", POLL_INTERVAL_MS / 1000, "s, timeout", DEPLOYMENT_TIMEOUT_MS / 1000, "s");

  while (Date.now() - start < DEPLOYMENT_TIMEOUT_MS) {
    const status = await verificarStatusDeployment();
    if (status === "running" || (typeof status === "string" && status.startsWith("running"))) {
      console.log("[Coolify] aguardarDeployment: status running alcançado", status);
      return true;
    }
    console.log("[Coolify] aguardarDeployment: status atual", status, "- aguardando...");
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  console.log("[Coolify] aguardarDeployment: timeout");
  return false;
}

/**
 * Reinicia (redeploy) a aplicação no Coolify.
 */
export async function redeploy(): Promise<{ deploymentUuid?: string }> {
  if (!COOLIFY_APP_UUID || !COOLIFY_API_TOKEN || !COOLIFY_URL) {
    throw new Error(
      "Variáveis COOLIFY_URL, COOLIFY_API_TOKEN e COOLIFY_APP_UUID são obrigatórias."
    );
  }
  console.log("[Coolify] redeploy: reiniciando aplicação");
  const data = await coolifyFetch<{ deployment_uuid?: string; uuid?: string }>(
    `/api/v1/applications/${COOLIFY_APP_UUID}/restart`,
    { method: "POST" }
  );
  console.log("[Coolify] redeploy: sucesso", data);
  return { deploymentUuid: data.deployment_uuid ?? data.uuid };
}

/**
 * Adiciona um subdomínio à aplicação Coolify:
 * 1) GET aplicação 2) Adiciona FQDN do subdomínio 3) PATCH aplicação 4) POST restart 5) Poll até running.
 */
export async function adicionarSubdominio(
  subdominioCliente: string
): Promise<AdicionarSubdominioResult> {
  if (!COOLIFY_URL || !COOLIFY_API_TOKEN || !COOLIFY_APP_UUID || !COOLIFY_BASE_DOMAIN) {
    return {
      success: false,
      error:
        "Configuração Coolify incompleta (COOLIFY_URL, COOLIFY_API_TOKEN, COOLIFY_APP_UUID, COOLIFY_BASE_DOMAIN).",
    };
  }

  const novoFqdn = `https://${subdominioCliente}.${COOLIFY_BASE_DOMAIN}`.toLowerCase();
  const subdominioNorm = subdominioCliente.toLowerCase().trim();
  if (!subdominioNorm || !/^[a-z0-9-]+$/.test(subdominioNorm)) {
    return { success: false, error: "Subdomínio inválido (apenas a-z, 0-9 e hífen)." };
  }

  try {
    console.log("[Coolify] adicionarSubdominio: subdomínio", subdominioNorm, "->", novoFqdn);

    const app = await getApplication();
    const fqdnAtual = (app.fqdn as string) || "";
    const dominiosExistentes = fqdnAtual
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    if (dominiosExistentes.includes(novoFqdn)) {
      console.log("[Coolify] adicionarSubdominio: subdomínio já existe");
      return { success: true, url: novoFqdn };
    }

    const novaLista = [...dominiosExistentes, novoFqdn];
    const fqdnAtualizado = novaLista.join(",");
    console.log("[Coolify] adicionarSubdominio: PATCH domains", fqdnAtualizado);

    // Coolify PATCH aceita "domains" (string). GET retorna "fqdn".
    await coolifyFetch(`/api/v1/applications/${COOLIFY_APP_UUID}`, {
      method: "PATCH",
      body: JSON.stringify({ domains: fqdnAtualizado }),
    });

    await redeploy();
    const pronto = await aguardarDeployment();
    if (!pronto) {
      return {
        success: false,
        url: novoFqdn,
        error: "Timeout ao aguardar deployment (10 minutos).",
      };
    }

    return { success: true, url: novoFqdn };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Coolify] adicionarSubdominio: erro", message);
    return { success: false, error: message };
  }
}
