import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { User, Menu } from "lucide-react";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";
import CartSidebar from "@/components/CartSidebar";

// Using a slightly tighter weight for luxury feel
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Intercore Furnishings",
  description: "Premium modern interior design and furniture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col text-zinc-900 bg-[#FAFAFA]`}>
        {/* Upgraded Glassmorphism Navbar */}
        <header className="fixed top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-zinc-200/50 transition-all">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* Left: Mobile Menu & Desktop Links */}
            <div className="flex-1 flex items-center gap-8">
              <button className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-black transition-colors">
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>
              <nav className="hidden md:flex gap-8 text-[13px] uppercase tracking-widest font-medium text-zinc-500">
                <Link href="/catalog" className="hover:text-black transition-colors">Shop</Link>
                <Link href="/collections" className="hover:text-black transition-colors">Collections</Link>
              </nav>
            </div>

            {/* Center: Brand */}
            <Link href="/" className="text-2xl font-semibold tracking-tighter shrink-0">
              INTERCORE.
            </Link>

            {/* Right: Utilities */}
            <div className="flex-1 flex justify-end items-center gap-4">
              <button className="p-2 text-zinc-500 hover:text-black transition-colors">
                <User className="w-5 h-5 stroke-[1.5]" />
              </button>
              <CartIcon />
            </div>
          </div>
        </header>

        {/* Main Content Area (Added padding for fixed header) */}
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* Minimalist Footer */}
        <footer className="border-t border-zinc-200/50 bg-white py-16 mt-20">
          <div className="container mx-auto px-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold tracking-tight mb-4">INTERCORE.</h2>
            <p className="text-[13px] uppercase tracking-widest text-zinc-400 mb-8">Mindful Design, Crafted for Life</p>
            <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} Intercore Furnishings. All rights reserved.</p>
          </div>
        </footer>

        <CartSidebar />
      </body>
    </html>
  );
}