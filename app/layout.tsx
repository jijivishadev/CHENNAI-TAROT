// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import AnnouncementBar from "@/components/shared/AnnouncementBar";
import GlobalHeader from "@/components/home/GlobalHeader";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F3ECFF] text-[#333333] antialiased`}
      >
        <div>{children}</div>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZRJZ19FC3R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZRJZ19FC3R');`}
        </Script>

        {/* Zoho SalesIQ */}
        <Script id="zoho-salesiq-init" strategy="afterInteractive">
          {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.com/widget?wc=siqb3a19061089e37d692b7535f10a238c7326e863fcbd76227eb8ac78075e34e15"
          strategy="afterInteractive"
          defer
        />

        {/* Zoho PageSense */}
        <Script
          id="zoho-pagesense"
          src="https://cdn.pagesense.io/js/bzcxano3/270685c2610343aab5849e65921a3e8e.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}