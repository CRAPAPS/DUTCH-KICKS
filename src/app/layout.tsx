import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import HUDHeader from "@/components/HUDHeader";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dutch Kicks — The Drop Never Stops",
  description:
    "Live sneaker, UFC card, and collector resale platform. Powered by Whatnot.",
  metadataBase: new URL("https://dutchkicks.com"),
  openGraph: {
    title: "Dutch Kicks",
    description: "The Drop Never Stops",
    type: "website",
    url: "https://dutchkicks.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dutch Kicks — The Drop Never Stops",
    description: "Live sneaker, UFC card, and collector resale platform. Powered by Whatnot.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${barlow.variable} noise bg-noir text-white antialiased`}
      >
        <Providers>
          <HUDHeader />
          <main className="min-h-screen pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
