// src/components/AddToCartButton.tsx
"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_urls[0],
      quantity: 1,
    });
    
    // Show brief success feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:from-amber-500 hover:to-amber-400 transition-all flex items-center gap-2"
    >
      <ShoppingCart size={20} />
      {isAdded ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}