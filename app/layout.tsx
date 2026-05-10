import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./ClientProviders";
import { SEO } from "@/components/seo/SEO";
import { organizationLd, websiteLd } from "@/lib/seo/jsonld";
import { hreflangFor } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: {
    default: "KalbaLab — Learn Lithuanian, in your language",
    template: "%s | KalbaLab",
  },
  description:
    "Learn Lithuanian with explanations in your own language — Bengali, Hindi, Uzbek, Tajik, Kyrgyz, Azerbaijani or English. Native audio on every word and complete A1 exam preparation.",
  keywords: ["Lithuanian language", "learn Lithuanian", "A1 exam", "Lietuvių kalba", "language learning", "KalbaLab"],
  metadataBase: new URL("https://kalbalab.lt"),
  alternates: { canonical: "/", languages: hreflangFor("/") },
  openGraph: {
    title: "KalbaLab — Learn Lithuanian, in your language",
    description: "Lithuanian language learning for international communities — native audio, multilingual explanations, complete A1 exam prep.",
    url: "https://kalbalab.lt",
    siteName: "KalbaLab",
    type: "website",
    locale: "en_US",
    // Default share image for every platform that reads OG (Facebook,
    // LinkedIn, Messenger, WhatsApp, Slack, Discord, Telegram, Pinterest).
    images: [
      {
        url: "/social-share-kalbalab.png",
        width: 1730,
        height: 909,
        alt: "KalbaLab — Learn Lithuanian, in your language",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KalbaLab — Learn Lithuanian, in your language",
    description: "Multilingual Lithuanian learning + A1 exam prep.",
    images: ["/social-share-kalbalab.png"],
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon_io/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon_io/favicon.ico",
  },
  manifest: "/favicon_io/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kalba Lab",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <SEO blocks={[organizationLd(), websiteLd()]} />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
