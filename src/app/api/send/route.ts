import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
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
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
