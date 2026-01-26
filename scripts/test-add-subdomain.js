/**
 * Teste: adicionar um subdomínio à aplicação Coolify.
 * Uso: node scripts/test-add-subdomain.js <subdominio>
 * Exemplo: node scripts/test-add-subdomain.js teste-loja
 *
 * Carrega .env da raiz. Faz GET app → adiciona FQDN → PATCH → restart → polling até running.
 */

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const t = line.trim();
    if (t && !t.startsWith("#")) {
      const i = t.indexOf("=");
      if (i > 0) {
        const key = t.slice(0, i).trim();
        let val = t.slice(i + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  });
}

const COOLIFY_URL = (process.env.COOLIFY_URL || "").replace(/\/$/, "");
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN || "";
const COOLIFY_APP_UUID = process.env.COOLIFY_APP_UUID || "";
const COOLIFY_BASE_DOMAIN = process.env.COOLIFY_BASE_DOMAIN || "";

const POLL_INTERVAL_MS = 10_000;
const DEPLOYMENT_TIMEOUT_MS = 10 * 60 * 1000;

function subdomainFromArg() {
  const arg = process.argv[2];
  if (arg && /^[a-z0-9-]+$/i.test(arg)) return arg.toLowerCase().trim();
  return "petshop";
}

async function coolifyFetch(path, options = {}) {
  const url = `${COOLIFY_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {
    Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
    "Content-Type": "application/json",
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Resposta inválida: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg = data.message || res.statusText || text.slice(0, 200);
    throw new Error(`Coolify ${res.status}: ${msg}`);
  }
  return data;
}

async function getApp() {
  return coolifyFetch(`/api/v1/applications/${COOLIFY_APP_UUID}`);
}

async function waitUntilRunning() {
  const start = Date.now();
  console.log("[test] Aguardando deployment (poll a cada 10s, máx 10 min)...");
  while (Date.now() - start < DEPLOYMENT_TIMEOUT_MS) {
    const app = await getApp();
    const status = app.status || "";
    if (status === "running" || status.startsWith("running")) {
      console.log("[test] Status:", status, "- pronto.");
      return true;
    }
    console.log("[test] Status atual:", status);
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  console.log("[test] Timeout aguardando deployment.");
  return false;
}

async function run() {
  const sub = subdomainFromArg();
  const explicit = process.argv[2];
  if (!explicit) {
    console.log("Subdomínio não informado. Usando padrão: petshop");
    console.log("(Para outro subdomínio: node scripts/test-add-subdomain.js <nome>)\n");
  }

  if (!COOLIFY_URL || !COOLIFY_API_TOKEN || !COOLIFY_APP_UUID || !COOLIFY_BASE_DOMAIN) {
    console.error("Erro: defina COOLIFY_URL, COOLIFY_API_TOKEN, COOLIFY_APP_UUID e COOLIFY_BASE_DOMAIN no .env");
    process.exit(1);
  }

  const novoFqdn = `https://${sub}.${COOLIFY_BASE_DOMAIN}`;
  console.log("--- Teste: adicionar subdomínio ---");
  console.log("Subdomínio:", sub);
  console.log("FQDN:", novoFqdn);
  console.log("");

  try {
    console.log("[1/4] GET aplicação...");
    const app = await getApp();
    const fqdnAtual = app.fqdn || "";
    const lista = fqdnAtual.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);

    if (lista.includes(novoFqdn)) {
      console.log("Subdomínio já existe na aplicação. Nenhuma alteração feita.");
      console.log("URL:", novoFqdn);
      return;
    }

    const novaLista = [...lista, novoFqdn];
    const domainsStr = novaLista.join(",");
    console.log("[2/4] PATCH applications (domains)...");
    await coolifyFetch(`/api/v1/applications/${COOLIFY_APP_UUID}`, {
      method: "PATCH",
      body: JSON.stringify({ domains: domainsStr }),
    });
    console.log("[3/4] POST restart...");
    await coolifyFetch(`/api/v1/applications/${COOLIFY_APP_UUID}/restart`, { method: "POST" });
    console.log("[4/4] Aguardando deployment...");
    const ok = await waitUntilRunning();

    if (ok) {
      console.log("");
      console.log("Sucesso. Novo subdomínio ativo:");
      console.log("  ", novoFqdn);
    } else {
      console.log("");
      console.log("Subdomínio foi adicionado e restart enviado, mas o deployment não entrou em 'running' no tempo limite. Verifique no painel do Coolify.");
      console.log("URL configurada:", novoFqdn);
    }
  } catch (err) {
    console.error("Erro:", err.message);
    process.exit(1);
  }
}

run();
