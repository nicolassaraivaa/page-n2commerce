import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://n2commercee.vercel.app"
  ),
  icons: {
    icon: "/favicon.svg",
  },
  title: "N2Commerce | Seu e-commerce começa aqui",
  description:
    "Plataforma SaaS que simplifica o acesso ao comércio digital. Layout personalizado, estrutura completa, zero complicação.",
  keywords: [
    "e-commerce",
    "comercio eletronico",
    "loja virtual",
    "loja online",
    "loja",
    "vender mais",
    "loja propria",
    "e-commerce barato",
    "loja barata",
    "saas",
    "comercio digital",
    "layout personalizado",
    "estrutura completa",
    "zero complicação",
    "suporte 24h",
  ],
  openGraph: {
    title: "N2Commerce | Seu e-commerce começa aqui",
    description:
      "Plataforma SaaS que simplifica o acesso ao comércio digital. Layout personalizado, estrutura completa, zero complicação.",
    type: "website",
    locale: "pt-BR",
    siteName: "N2Commerce",
    images: [
      {
        url: "/openGraph.png",
        width: 1200,
        height: 630,
        alt: "N2Commerce | Seu e-commerce começa aqui",
      },
    ],
  },
  twitter: {
    title: "N2Commerce | Seu e-commerce começa aqui",
    description:
      "Plataforma SaaS que simplifica o acesso ao comércio digital. Layout personalizado, estrutura completa, zero complicação.",
    card: "summary_large_image",
    images: [
      {
        url: "/openGraph.png",
        width: 1200,
        height: 630,
        alt: "N2Commerce | Seu e-commerce começa aqui",
      },
    ],
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_APP_URL || "https://n2commercee.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {children}
        <Toaster position="top-center" duration={5000} />
      </body>
    </html>
  );
}
