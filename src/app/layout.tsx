import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarData } from "@/components/master-layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taneri Apartmanı Site Yönetimi",
  description: "Apartman ve site yönetimi için modern çözüm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="flex-1 flex md:grid md:grid-cols-[250px_minmax(0,1fr)]">  
            {/* Sol Sidebar (Mobilde component içindeki hidden class'ı ile gizleniyor) */}
            <SidebarData />

            {/* Sağ İçerik Alanı */}
            <main className="flex flex-col w-full p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
               {children}
            </main>
            <Toaster/>
          </div>
        {/* İleride buraya Footer gelecek */}
      </body>
    </html>
  );
}
