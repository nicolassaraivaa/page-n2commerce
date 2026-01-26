/**
 * Teste de requisição à API do Coolify.
 * Uso: node scripts/test-coolify.js
 * Carrega .env da raiz do projeto.
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

async function test() {
  console.log("--- Teste Coolify API ---");
  console.log("COOLIFY_URL:", COOLIFY_URL ? `${COOLIFY_URL.substring(0, 30)}...` : "(não definido)");
  console.log("COOLIFY_APP_UUID:", COOLIFY_APP_UUID || "(não definido)");
  console.log("Token definido:", !!COOLIFY_API_TOKEN);
  console.log("");

  if (!COOLIFY_URL || !COOLIFY_API_TOKEN) {
    console.error("Erro: defina COOLIFY_URL e COOLIFY_API_TOKEN no .env");
    process.exit(1);
  }

  const headers = {
    Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    // 1) Listar aplicações para descobrir UUIDs
    const listUrl = `${COOLIFY_URL}/api/v1/applications`;
    console.log("GET (listar)", listUrl);
    const listRes = await fetch(listUrl, { method: "GET", headers });
    const listText = await listRes.text();
    let listData;
    try {
      listData = listText ? JSON.parse(listText) : [];
    } catch {
      console.error("Resposta da listagem não é JSON:", listText.slice(0, 200));
      process.exit(1);
    }

    if (!listRes.ok) {
      console.error("Falha ao listar:", listRes.status, listRes.statusText);
      console.error("Body:", listText.slice(0, 500));
      process.exit(1);
    }

    const apps = Array.isArray(listData) ? listData : listData.applications || listData.data || [];
    console.log("OK", listRes.status, "-", apps.length, "aplicação(ões) encontrada(s)\n");

    if (apps.length === 0) {
      console.log("Nenhuma aplicação nesta instância Coolify. Crie uma no painel e tente de novo.");
      return;
    }

    console.log("Lista de aplicações (use o uuid no .env como COOLIFY_APP_UUID):");
    console.log("---");
    apps.forEach((app, i) => {
      const uuid = app.uuid || app.id;
      const name = app.name || "(sem nome)";
      const fqdn = app.fqdn || app.domains || "";
      console.log(`  ${i + 1}. ${name}`);
      console.log(`     uuid: ${uuid}`);
      if (fqdn) console.log(`     fqdn: ${fqdn}`);
      console.log("");
    });
    console.log("---\n");

    if (!COOLIFY_APP_UUID) {
      console.log("COOLIFY_APP_UUID não está no .env. Adicione um dos uuid acima.");
      return;
    }

    // 2) Buscar aplicação pelo UUID do .env
    const url = `${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}`;
    console.log("GET (por uuid)", url);
    const res = await fetch(url, { method: "GET", headers });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error("Resposta não é JSON:", text.slice(0, 300));
      process.exit(1);
    }

    if (!res.ok) {
      if (res.status === 404) {
        console.error("404 Application not found.");
        console.error("O UUID no .env (COOLIFY_APP_UUID) não existe nesta instância.");
        console.error("Copie um dos uuid da lista acima e atualize o .env.");
        process.exit(1);
      }
      console.error("Falha:", res.status, res.statusText);
      console.error("Body:", JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log("OK", res.status);
    console.log("Aplicação:", data.name ?? data.uuid ?? "(sem nome)");
    console.log("Status:", data.status ?? "(não retornado)");
    console.log("FQDN/domínios:", data.fqdn ?? data.domains ?? "(nenhum)");
    console.log("");
    console.log("Resposta (resumida):", JSON.stringify({
      uuid: data.uuid,
      name: data.name,
      status: data.status,
      fqdn: data.fqdn,
      domains: data.domains,
    }, null, 2));
  } catch (err) {
    console.error("Erro na requisição:", err.message);
    if (err.cause) console.error("Cause:", err.cause);
    process.exit(1);
  }
}

test();
