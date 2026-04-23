import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./ClientProviders";

export const metadata: Metadata = {
  title: {
    default: "LithuanianBD — লিথুয়ানিয়ান শিখুন বাংলায়",
    template: "%s | LithuanianBD",
  },
  description:
    "Learn Lithuanian language with Bengali explanations. Designed for Bangladeshi people living in or moving to Lithuania. A1 exam preparation included.",
  keywords: ["Lithuanian language", "learn Lithuanian", "Bengali", "Bangla", "Lithuania", "A1 exam", "লিথুয়ানিয়ান ভাষা"],
  openGraph: {
    title: "LithuanianBD — লিথুয়ানিয়ান শিখুন বাংলায়",
    description: "Lithuanian language learning for Bangladeshi people — with Bengali explanations, audio, and A1 exam prep.",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
