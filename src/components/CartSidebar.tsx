"use client";

import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartSidebar() {
  const router = useRouter();

  // --- ZUSTAND STORE HOOKS ---
  // Pulling the dynamic state from your global store
  const { isOpen, items, closeCart, cartTotal } = useCartStore();

  const handleCheckoutRedirect = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* 1. The Dark Overlay (click to close) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* 2. The Sidebar Container */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-zinc-200 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-sm uppercase tracking-widest font-medium text-zinc-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Your Cart
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <ShoppingBag className="w-12 h-12 stroke-[1]" />
              <p className="text-sm font-light">Your cart is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Maps through your dynamic Zustand items array */}
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-zinc-50 pb-4">
                  <div className="w-20 h-20 bg-zinc-100 rounded-md"></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-zinc-900">{item.name}</h3>
                    <p className="text-sm text-zinc-500">
                      ₹{item.price.toLocaleString()}
                      {item.quantity > 1 && (
                        <span className="ml-2 text-xs text-zinc-400">x{item.quantity}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-widest font-medium text-zinc-500">Subtotal</span>
            <span className="text-lg font-medium text-zinc-900">₹{cartTotal.toLocaleString()}</span>
          </div>
          
          <button
            onClick={handleCheckoutRedirect}
            disabled={items.length === 0}
            className="w-full bg-zinc-900 text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}