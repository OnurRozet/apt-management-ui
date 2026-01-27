import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 1. Session Kontrolü
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;


  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className={`flex-1 flex md:grid w-full `}>
          {/* Sol Sidebar (Mobilde component içindeki hidden class'ı ile gizleniyor) */}
          {/* {token && <SidebarData />} */}

          {/* Sağ İçerik Alanı */}
          <main className="flex flex-col w-full p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
          <Toaster />
        </div>
        {/* İleride buraya Footer gelecek */}
      </body>
    </html>
  );
}
