"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  
  // 1. Pull the openCart function from the store
  const { items, openCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-lg font-medium tracking-tighter text-zinc-900">
          INTERCORE.
        </Link>

        <nav className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="/catalog" className="text-xs uppercase tracking-widest font-medium text-zinc-500 hover:text-black transition-colors">
                Catalog
            </Link>
            <Link href="/about" className="text-xs uppercase tracking-widest font-medium text-zinc-500 hover:text-black transition-colors">
                 About
            </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/profile" className="text-zinc-500 hover:text-black transition-colors">
            <User className="w-4 h-4" />
          </Link>

          {/* 2. Change this back to a button and add onClick={openCart} */}
          <button 
            onClick={openCart}
            className="text-zinc-500 hover:text-black transition-colors relative flex items-center"
          >
            <ShoppingCart className="w-4 h-4" />
            {isMounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}