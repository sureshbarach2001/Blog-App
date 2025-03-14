import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NIVOX",
  description: "A sleek, quantum-inspired blog platform built with Next.js",
  icons: {
    icon: "https://assets.grok.com/users/e55a76f6-9de3-4b01-b387-6f930e4d3db7/FdtcuE5DS4x1Cc8n-generated_image.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <AuthProvider>
            <Navbar />
            <main className="container mx-auto p-4">{children}</main>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}