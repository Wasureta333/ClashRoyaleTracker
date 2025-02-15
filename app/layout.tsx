"use client";

import "../styles/globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head />
      <body className="flex flex-col min-h-screen">
        <Navbar/>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
