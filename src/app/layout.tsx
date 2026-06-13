import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar"; // <--- 1. Import it

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intercore | Premium Architectural Furniture",
  description: "Explore our curated selection of premium architectural furniture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-zinc-900 min-h-screen flex flex-col`}>
        <Navbar />
        <CartSidebar /> {/* <--- 2. Add it globally here */}
        
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}