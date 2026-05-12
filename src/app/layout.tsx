import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromoRadar — Promoções perto de você",
  description: "Receba alertas de promoções em mercados e farmácias perto de você",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-slate-50 dark:bg-slate-900">
        <Providers>
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-4">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
