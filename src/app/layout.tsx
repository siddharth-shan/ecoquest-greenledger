import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/layout/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EcoQuest GreenLedger — Cerritos Budget & Sustainability Dashboard",
  description:
    "A youth-friendly sustainability dashboard that makes Cerritos city budget data interactive and drives community engagement through challenges and civic actions.",
  keywords:
    "Cerritos, budget, sustainability, green, environment, civic engagement, EcoQuest",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
