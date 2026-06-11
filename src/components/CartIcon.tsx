"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartIcon() {
  const { openCart, items } = useCartStore();

  // Calculate total number of items (accounting for item quantities)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
      aria-label="Open cart"
    >
      <ShoppingBag className="w-5 h-5" />
      
      {/* Dynamic Badge - Only visible if there are items in the cart */}
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-[5px] py-[2px] text-[10px] font-medium leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-zinc-900 rounded-full">
          {itemCount}
        </span>
      )}
    </button>
  );
}