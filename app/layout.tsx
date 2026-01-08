import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BackButton from "./components/ui/BackButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas Sports Group | Youth & Adult Sports Programs in the Tri-Cities",
  description: "Building healthy habits through sport. Offering youth and adult programs in flag football, baseball, field hockey, and multi-sport camps across the Tri-Cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${lexend.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        <BackButton />
      </body>
    </html>
  );
}
