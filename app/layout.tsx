// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import AnnouncementBar from "@/components/shared/AnnouncementBar";
import GlobalHeader from "@/components/home/GlobalHeader";
import ThirdPartyScripts from "@/components/shared/ThirdPartyScripts";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // REMOVE THE TEMPLATE - just keep a simple title
  title: "Jothi Ramesh - Psychic | Intuitive Business and Money Coach",
  description: "Wealth coaching, programs, and resources from Million Dollars Coach.",
  icons: {
    icon: "/Fev Million.png",
    shortcut: "/Fev Million.png",
    apple: "/Fev Million.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F3ECFF] text-[#333333] antialiased`}
      >
        <div>{children}</div>
        <ThirdPartyScripts />
      </body>
    </html>
  );
}