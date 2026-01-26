/**
 * Store de status de provisionamento (subdomínio Coolify).
 * Em produção você pode substituir por banco de dados (ex.: no backend).
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export type ProvisioningStatus =
  | "provisionando"
  | "ativo"
  | "erro_provisionamento";

export type ProvisioningRecord = {
  subdominio: string;
  ecommerceId?: string;
  status: ProvisioningStatus;
  url?: string | null;
  provisionado_em?: string | null; // ISO datetime
  erro_provisionamento?: string | null;
  email?: string | null;
  criado_em: string; // ISO datetime
  atualizado_em: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "provisioning.json");

type Store = Record<string, ProvisioningRecord>;

async function ensureDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignorar se já existir
  }
}

async function readStore(): Promise<Store> {
  await ensureDir();
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Store;
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

async function writeStore(store: Store): Promise<void> {
  await ensureDir();
  await writeFile(FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

const now = () => new Date().toISOString();

/**
 * Cria ou atualiza registro por subdomínio (clienteId).
 */
export async function upsertProvisioning(
  subdominio: string,
  update: Partial<Omit<ProvisioningRecord, "subdominio" | "criado_em">> & { ecommerceId?: string }
): Promise<ProvisioningRecord> {
  const store = await readStore();
  const key = subdominio.toLowerCase().trim();
  const existing = store[key];
  const criado_em = existing?.criado_em ?? now();
  const atualizado_em = now();
  const record: ProvisioningRecord = {
    subdominio: key,
    ecommerceId: update.ecommerceId ?? existing?.ecommerceId,
    status: update.status ?? existing?.status ?? "provisionando",
    url: update.url !== undefined ? update.url : existing?.url,
    provisionado_em: update.provisionado_em !== undefined ? update.provisionado_em : existing?.provisionado_em,
    erro_provisionamento:
      update.erro_provisionamento !== undefined
        ? update.erro_provisionamento
        : existing?.erro_provisionamento,
    email: update.email !== undefined ? update.email : existing?.email,
    criado_em,
    atualizado_em,
  };
  store[key] = record;
  await writeStore(store);
  return record;
}

/**
 * Busca registro por subdomínio (clienteId).
 */
export async function getProvisioning(
  clienteId: string
): Promise<ProvisioningRecord | null> {
  const store = await readStore();
  const key = clienteId.toLowerCase().trim();
  return store[key] ?? null;
}
