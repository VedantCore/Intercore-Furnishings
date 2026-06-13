"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Package, LogOut, Loader2, Calendar, Edit2, X, Check, Shield } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

// Add your secure admin email(s) here
const ADMIN_EMAILS = ["vserva2006@gmail.com"];

interface Order {
  id: string;
  razorpay_payment_id: string;
  total_amount: number;
  created_at: string;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Profile Edit States
  const [userName, setUserName] = useState<string>("Valued Client");
  const [isEditing, setIsEditing] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      // 1. Verify User
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUserEmail(session.user.email || null);
      
      // Pull the user's name from Supabase metadata (if they have set one)
      const fullName = session.user.user_metadata?.full_name;
      if (fullName) {
        setUserName(fullName);
        setEditNameInput(fullName);
      }

      // 2. Fetch User's Orders
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", session.user.email)
        .order("created_at", { ascending: false });

      if (orderData) setOrders(orderData);
      setIsLoading(false);
    };

    fetchProfileData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useCartStore.getState().clearCart();
    router.push("/login");
    router.refresh();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Update the user's metadata in Supabase Auth
    const { error } = await supabase.auth.updateUser({
      data: { full_name: editNameInput }
    });

    if (!error) {
      setUserName(editNameInput);
      setIsEditing(false);
    } else {
      alert("Failed to update profile.");
    }
    
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-16 border-b border-zinc-100 pb-8 gap-6">
        
        {/* Left Side: Name & Edit Form */}
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                required
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                placeholder="Enter your full name"
                className="border border-zinc-200 px-3 py-2 text-2xl font-medium tracking-tight text-zinc-900 focus:border-black focus:ring-0 outline-none w-full sm:w-auto"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-black text-white p-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-zinc-100 text-zinc-600 p-2 hover:bg-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="group flex items-center gap-3">
              <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-1">{userName}</h1>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-zinc-300 hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                title="Edit Name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-sm font-light text-zinc-500 mt-2">{userEmail}</p>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          
          {/* THE BOUNCER: Admin Dashboard Link - Case-insensitive check */}
          {userEmail && ADMIN_EMAILS.some(email => email.toLowerCase().trim() === userEmail.toLowerCase().trim()) && (
            <Link
              href="/admin"
              className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-500 hover:text-black transition-colors pt-2"
            >
              <Shield className="w-4 h-4 mr-2" /> Admin Panel
            </Link>
          )}

          <button
            onClick={handleSignOut}
            className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-500 hover:text-black transition-colors pt-2"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </div>

      {/* Order History Section */}
      <div>
        <h2 className="text-sm uppercase tracking-widest font-medium text-zinc-900 mb-8 flex items-center gap-2">
          <Package className="w-4 h-4" /> Order History
        </h2>

        {orders.length === 0 ? (
          <div className="bg-zinc-50 p-12 text-center rounded-sm">
            <p className="text-sm font-light text-zinc-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/catalog" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 transition-colors">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-zinc-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-zinc-200 transition-colors">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-zinc-900">Order #{order.razorpay_payment_id ? order.razorpay_payment_id.replace('pay_', '') : order.id.slice(0,8)}</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase tracking-widest font-medium rounded-sm">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-zinc-900">₹{order.total_amount.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400 mt-1">Secured via Razorpay</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}