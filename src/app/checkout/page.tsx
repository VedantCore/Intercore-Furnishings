"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, Loader2, Tag, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const loadRazorpayScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, cartTotal, clearCart } = useCartStore();
  
  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Checkout Fields
  const [deliveryDate, setDeliveryDate] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Math
  const subtotal = cartTotal;
  const shipping = 0; // Free shipping for luxury items
  const finalTotal = subtotal + shipping - discount;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUserEmail(session.user.email || null);
      }
    };
    checkAuth();
  }, [router]);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "STUDIO10") {
      setDiscount(subtotal * 0.10); // 10% off
      alert("Coupon applied successfully!");
    } else {
      alert("Invalid coupon code.");
      setDiscount(0);
    }
  };

  const handleSecureCheckout = async () => {
    if (!deliveryDate) return alert("Please select a preferred delivery date.");
    if (!agreedToTerms) return alert("Please agree to the terms and conditions.");
    
    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) throw new Error("Razorpay SDK failed to load.");

      const orderResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error("Server failed to generate order");

      const options = {
        key: "rzp_test_T0HTggTI47vAg6", // <-- Replace with your hardcoded ID
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        name: "Intercore Furnishings",
        description: `Order Delivery: ${deliveryDate}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Save to DB
            const { error: insertError } = await supabase.from('orders').insert([{
              total_amount: finalTotal,
              razorpay_payment_id: response.razorpay_payment_id,
              customer_email: userEmail,
              status: "paid"
            }]);
            if (insertError) throw insertError;

            // Trigger Resend Email
            if (userEmail) {
              await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, orderId: response.razorpay_payment_id, amount: finalTotal }),
              });
            }

            clearCart();
            router.push('/catalog'); // Or a dedicated success page
            alert("Payment Successful! Receipt sent via email.");
          } catch (err) {
            console.error(err);
            alert("Payment succeeded, but an error occurred saving the details.");
          }
        },
        prefill: { email: userEmail || "" },
        theme: { color: "#000000" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <h1 className="text-2xl font-light text-zinc-900">Your cart is empty.</h1>
        <Link href="/catalog" className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 transition-colors">
          Return to Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-12">Secure Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        
        {/* LEFT COLUMN: Items & Logistics */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Cart Items Manager */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 pb-4">Order Items</h2>
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex py-2">
                  <div className="w-24 h-24 bg-zinc-100 rounded-md flex-shrink-0"></div>
                  <div className="ml-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-zinc-900">{item.name}</h3>
                      <p className="text-sm text-zinc-900 font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center mt-4 space-x-4">
                      <div className="flex items-center border border-zinc-200 rounded">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-zinc-50"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-zinc-50"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-500 flex items-center">
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Delivery Logistics */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 pb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Logistics
            </h2>
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">Preferred Delivery Date</label>
              <input
                type="date"
                required
                value={deliveryDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="block w-full sm:w-1/2 border border-zinc-200 px-4 py-3 text-sm focus:border-black focus:ring-0 transition-colors"
              />
              <p className="mt-2 text-xs text-zinc-500">Our logistics team will confirm this date via email.</p>
            </div>
          </section>

          {/* Cross-Sell / Upsell Placeholder */}
          <section className="bg-zinc-50 p-6 rounded-lg">
             <h2 className="text-xs uppercase tracking-widest text-zinc-900 mb-4">Complete the Look</h2>
             <div className="flex items-center justify-between border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-200"></div>
                  <div>
                    <p className="text-sm font-medium">Premium Wood Polish</p>
                    <p className="text-xs text-zinc-500">₹850</p>
                  </div>
                </div>
                <button className="text-xs uppercase tracking-widest border-b border-black hover:text-zinc-500 transition-colors">Add</button>
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <div className="bg-zinc-50 border border-zinc-100 p-8 sticky top-24">
            <h2 className="text-lg font-medium text-zinc-900 mb-6">Order Summary</h2>
            
            {/* Breakdown */}
            <dl className="space-y-4 text-sm text-zinc-600 border-b border-zinc-200 pb-6 mb-6">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-zinc-900">₹{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Standard Shipping</dt>
                <dd className="font-medium text-green-600">Free</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Discount Applied</dt>
                  <dd>-₹{discount.toLocaleString()}</dd>
                </div>
              )}
            </dl>

            <div className="flex justify-between text-lg font-medium text-zinc-900 mb-8">
              <dt>Total</dt>
              <dd>₹{finalTotal.toLocaleString()}</dd>
            </div>

            {/* Coupons */}
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Gift Card or Discount Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-zinc-200 px-4 py-2 text-sm uppercase placeholder:normal-case focus:border-black focus:ring-0"
                  placeholder="STUDIO10"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode}
                  className="px-4 py-2 bg-zinc-200 text-sm font-medium text-zinc-900 hover:bg-zinc-300 disabled:opacity-50 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Terms & Checkout */}
            <div className="space-y-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-black"
                />
                <label htmlFor="terms" className="ml-3 text-xs text-zinc-500">
                  I agree to the <a href="#" className="underline">Terms of Service</a> and confirm my delivery details are correct.
                </label>
              </div>

              <button
                onClick={handleSecureCheckout}
                disabled={isProcessing}
                className="w-full bg-zinc-900 text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {isProcessing ? "Processing..." : "Place Secure Order"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}