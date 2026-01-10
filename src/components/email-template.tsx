import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "https://saraivaa.shop";

export const EmailTemplate = ({
  name,
  email,
  phone,
  message,
}: EmailTemplateProps) => {
  const previewText = `Novo contato de ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/logo-email.png`}
              width="120"
              height="120"
              alt="N2Commerce"
              style={logo}
            />
          </Section>

          <Heading style={h1}>Novo Contato</Heading>
          <Container style={insideContainer}>
            <Text style={heroText}>
              Você recebeu uma nova mensagem através do site N2Commerce.
            </Text>

            <Section style={detailsBox}>
              <Row style={row}>
                <Column style={columnLabel}>Nome:</Column>
                <Column style={columnValue}>{name}</Column>
              </Row>
              <Hr style={divider} />
              <Row style={row}>
                <Column style={columnLabel}>Email:</Column>
                <Column style={columnValue}>
                  <a href={`mailto:${email}`} style={link}>
                    {email}
                  </a>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row style={row}>
                <Column style={columnLabel}>Telefone:</Column>
                <Column style={columnValue}>
                  <a href={`tel:${phone}`} style={link}>
                    {phone}
                  </a>
                </Column>
              </Row>
            </Section>

            <Section style={messageContainer}>
              <Heading as="h2" style={h2}>
                Mensagem:
              </Heading>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Container>

          <Text style={footer}>
            © {new Date().getFullYear()} N2Commerce. Todos os direitos
            reservados.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const insideContainer = {
  padding: "30px",
  borderRadius: "0 0 10px 10px",
  border: "1px solid #e0e0e0",
  borderTop: "none",
  margin: "0",
  width: "100%",
  maxWidth: "600px",
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
};

const logoContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const h1 = {
  color: "#fff",
  fontSize: "24px",
  fontWeight: "700",
  textAlign: "center" as const,
  padding: "30px",
  backgroundImage:
    "linear-gradient(to right top, #3f3f3f, #343434, #2a2a2a, #202020, #161616)",
  borderRadius: "10px 10px 0 0",
  marginBottom: "0",
};

const heroText = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "0 0 32px",
};

const detailsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "32px",
  border: "1px solid #e5e7eb",
};

const row = {
  margin: "8px 0",
};

const columnLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  width: "30%",
  paddingRight: "12px",
};

const columnValue = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: "500",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "12px 0",
};

const link = {
  color: "#111827",
  textDecoration: "none",
};

const messageContainer = {
  marginBottom: "32px",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const messageText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: "4px solid #111827",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "32px",
};
