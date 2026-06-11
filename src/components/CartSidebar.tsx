"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Utility to load the Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, cartTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      const total = cartTotal();

      // 1. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // 2. Call your Next.js API
      const orderResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      
      // If the backend crashed, stop here and alert the user
const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        console.error("Detailed Server Error:", orderData);
        throw new Error(`Server failed: ${orderData.details || orderData.error}`);
      }

      // 3. Open Razorpay Modal
      const options = {
        key: "rzp_test_T0HTggTI47vAg6", // <-- Paste your Key ID here
        amount: total * 100,
        currency: "INR",
        name: "Intercore Furnishings",
        description: "Premium Furniture Order",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const { data: orderData, error: orderError } = await supabase
              .from('orders')
              .insert([{
                total_amount: total,
                razorpay_payment_id: response.razorpay_payment_id,
                customer_email: "test@intercore.com",
                status: "paid"
              }])
              .select()
              .single();

            if (orderError) throw orderError;

            const orderItems = items.map(item => ({
              order_id: orderData.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price
            }));

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems);

            if (itemsError) throw itemsError;

            alert("Payment Successful! Your premium order has been secured.");
            clearCart();
            closeCart();
          } catch (err) {
            console.error("Database Error:", err);
            alert("Payment succeeded, but we had trouble saving your receipt.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@intercore.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000", 
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      // If the modal is closed without paying, stop processing
      paymentObject.on('payment.failed', function (response: any) {
        setIsProcessing(false);
      });
      
      paymentObject.open();
      
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong initializing the checkout.");
    } finally {
      // If the modal opens successfully, we can turn off the button spinner
      setIsProcessing(false); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-zinc-900 z-50 cursor-pointer backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-100">
              <h2 className="text-xl font-medium tracking-tight">Your Cart</h2>
              <button onClick={closeCart} className="p-2 text-zinc-400 hover:text-black transition-colors rounded-full hover:bg-zinc-50">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 font-light space-y-4">
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-center group">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover bg-zinc-50" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm tracking-tight mb-1">{item.name}</h3>
                        <p className="text-zinc-400 text-[13px] mb-2">Qty: {item.quantity}</p>
                        <p className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-zinc-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 border-t border-zinc-100 bg-white">
                <div className="flex justify-between mb-6">
                  <span className="font-light text-zinc-500">Subtotal</span>
                  <span className="font-medium text-lg tracking-tight">₹{cartTotal().toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-zinc-900 text-white py-4 flex items-center justify-center gap-2 text-sm tracking-widest uppercase font-medium hover:bg-black transition-colors disabled:bg-zinc-300"
                >
                  {isProcessing ? "Processing..." : "Secure Checkout"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}