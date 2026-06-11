"use client";

import { useCartStore } from "@/store/useCartStore";

// Defines the shape of the product data you pass into the button
interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    // 1. Add the item to the global store with a default quantity of 1
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1, 
    });
    
    // 2. Immediately slide the cart sidebar open
    openCart();
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-zinc-900 text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-zinc-800 transition-colors active:scale-[0.99]"
    >
      Add to Cart
    </button>
  );
}