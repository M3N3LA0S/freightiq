import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FreightIQ — EU Freight Quoting Platform",
    template: "%s | FreightIQ",
  },
  description:
    "Generate fully-landed sea, air, rail, and road freight quotes for EU sourcing teams — with live shipment tracking and customs duty calculation.",
  openGraph: {
    type: "website",
    locale: "en_EU",
    url: "https://freightiq.app",
    siteName: "FreightIQ",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
