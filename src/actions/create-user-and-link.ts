"use server";

import { upsertProvisioning } from "@/lib/provisioning-store";

export async function createUserAndLinkAction(
  prevState: any,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const adminName = formData.get("adminName") as string;
  const ecommerceId = formData.get("ecommerceId") as string;
  const subdomain = (formData.get("subdomain") as string)?.trim() || "";

  if (!email || !password || !adminName || !ecommerceId) {
    return { error: "Todos os campos são obrigatórios." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Email inválido. Por favor, digite um email válido." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `${backendUrl}/api/admin/create-user-and-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_API_SECRET}`,
        },
        body: JSON.stringify({
          ecommerceId,
          adminName,
          adminEmail: email,
          adminPassword: password,
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return {
        error: "Erro ao processar resposta do servidor. Tente novamente.",
      };
    }

    if (!response.ok) {
      console.error("Backend Error:", data);

      let errorMessage = data.details || data.error || "Erro ao criar usuário.";

      if (
        errorMessage.includes("email") ||
        errorMessage.includes("Email") ||
        errorMessage.includes("already been registered")
      ) {
        errorMessage =
          "Este email já está cadastrado. Por favor, use outro email ou faça login.";
      }

      return { error: errorMessage };
    }

    const loginUrl =
      process.env.BACKEND_LOGIN_URL || "http://localhost:3001/authentication";

    if (subdomain) {
      await upsertProvisioning(subdomain.toLowerCase(), { email });
    }

    return { success: true, loginUrl, subdomain: subdomain || undefined };
  } catch (error: any) {
    console.error("API Call Error:", error);

    if (error.name === "AbortError") {
      return {
        error: "Tempo de conexão esgotado. Verifique sua conexão e tente novamente.",
      };
    }

    if (error.cause?.code === "ECONNREFUSED" || error.code === "ECONNREFUSED") {
      return {
        error: `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${backendUrl}`,
      };
    }

    if (error.message?.includes("fetch failed")) {
      return {
        error: "Erro de conexão. Verifique sua internet e tente novamente.",
      };
    }

    return {
      error: "Erro ao conectar com o sistema. Por favor, tente novamente.",
    };
  }
}

