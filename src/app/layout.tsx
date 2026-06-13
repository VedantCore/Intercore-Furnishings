import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Intercore | Architectural Furniture",
  description: "Objects designed for those who choose environment over ornament.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${inter.className} antialiased bg-[#F8F6F2] text-[#1A1A18] min-h-screen flex flex-col`}
      >
        <Navbar />
        <CartSidebar />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}