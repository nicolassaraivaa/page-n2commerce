import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "RESEND_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, phone, message } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Bewear <notificacoes@saraivaa.shop>",
      to: ["n2commercee@gmail.com"],
      subject: `Novo contato de ${name}`,
      react: await EmailTemplate({ name, email, phone, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Erro ao enviar email",
      },
      { status: 500 }
    );
  }
}
