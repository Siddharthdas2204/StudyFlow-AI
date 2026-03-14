import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "StudyFlow AI | God-Tier Academic Platform",
  description: "The ultimate AI-powered study assistant for modern learners.",
};

import Background from "@/components/Background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <Background />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Toaster position="top-center" expand={true} richColors theme="dark" />
      </body>
    </html>
  );
}
