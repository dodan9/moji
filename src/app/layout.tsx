import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootHeader from "@/components/layouts/Header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moji",
  description: "Moji",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const naverMapKey = process.env.NEXT_PUBLIC_NAVER_MAP_KEY;

  return (
    <html lang='ko'>
      <head>
        <Script
          type='text/javascript'
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapKey}`}
          strategy='beforeInteractive'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
