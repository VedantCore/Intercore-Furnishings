// src/components/CartIcon.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartIcon() {
  const cartCount = useCartStore((state) => state.cartCount());
  const openCart = useCartStore((state) => state.openCart);

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:text-amber-400 transition-colors"
    >
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
}