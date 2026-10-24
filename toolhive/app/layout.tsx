import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_DESC } from "@/lib/tools";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://gettoolhive.vercel.app"),
  title: {
    default: "ToolHive — Free Online Tools",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: ["online tools", "free tools", "web tools", "all in one toolbox", "text tools", "image tools", "pdf tools"],
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free Online Tools`,
    description: SITE_DESC,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — free online tools` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Online Tools`,
    description: SITE_DESC,
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
  verification: process.env.NEXT_PUBLIC_GSC_TOKEN
    ? { other: { "google-site-verification": process.env.NEXT_PUBLIC_GSC_TOKEN } }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('th-theme')==='dark'||(!localStorage.getItem('th-theme')&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
