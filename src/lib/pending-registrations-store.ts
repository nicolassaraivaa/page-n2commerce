import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export type PendingRegistration = {
  id: string;
  plan: string; // "iniciante", "profissional", "enterprise"
  storeData: {
    name: string;
    subdomain: string;
    contactEmail: string;
    contactPhone: string;
    address: {
      zipCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    };
  };
  adminData: {
    name: string;
    cpf: string;
    email: string;
    password: string; // Plain text or hashed? ideally hashed but for this MVP... plain for now to pass to backend?
    // Wait, the backend expects raw password to create the user?
    // Looking at create-user-and-link.ts, it sends "adminPassword" to backend.
    // So we must store it here.
  };
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "pending-registrations.json");

type Store = Record<string, PendingRegistration>;

async function ensureDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore if exists
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

export async function createPendingRegistration(
  data: Omit<PendingRegistration, "id" | "createdAt">,
): Promise<string> {
  const store = await readStore();
  const id = randomUUID();

  store[id] = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  await writeStore(store);
  return id;
}

export async function getPendingRegistration(
  id: string,
): Promise<PendingRegistration | null> {
  const store = await readStore();
  return store[id] || null;
}

export async function deletePendingRegistration(id: string): Promise<void> {
  const store = await readStore();
  if (store[id]) {
    delete store[id];
    await writeStore(store);
  }
}
