import { redirect } from "next/navigation";
import { ProvisionandoContent } from "./provisionando-content";

interface ProvisionandoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProvisionandoPage({
  searchParams,
}: ProvisionandoPageProps) {
  const params = await searchParams;
  const cliente = Array.isArray(params?.cliente)
    ? params.cliente[0]
    : params?.cliente;
  if (!cliente?.trim()) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <ProvisionandoContent clienteId={cliente.trim()} />
    </div>
  );
}
