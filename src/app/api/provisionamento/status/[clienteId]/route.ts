import { getStatusProvisionamento } from "@/actions/provisionar-cliente";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ clienteId: string }> }
) {
  const { clienteId } = await params;
  if (!clienteId) {
    return Response.json(
      { error: "clienteId é obrigatório" },
      { status: 400 }
    );
  }
  try {
    const result = await getStatusProvisionamento(clienteId);
    return Response.json(result);
  } catch (err) {
    console.error("[API provisionamento/status]", err);
    return Response.json(
      { status: null, mensagem: "Erro ao consultar status." },
      { status: 500 }
    );
  }
}
