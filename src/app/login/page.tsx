"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration-only States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // --- REGISTRATION FLOW ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              age: age,
              sex: sex,
              address: address,
              city: city,
              postal_code: postalCode,
            }
          }
        });
        if (error) throw error;
      }
      
      router.push("/catalog");
      router.refresh(); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`sm:mx-auto sm:w-full px-4 transition-all duration-500 ${isLogin ? "sm:max-w-md" : "sm:max-w-2xl"}`}>
        
        <Link href="/" className="inline-flex items-center text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-8 transition-colors group">
          <ArrowLeft className="w-3 h-3 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Store
        </Link>

        <h2 className="text-3xl font-medium tracking-tight text-zinc-900 mb-2">
          {isLogin ? "Welcome back." : "Create an account."}
        </h2>
        <p className="text-sm text-zinc-500 font-light mb-8">
          {isLogin 
            ? "Enter your details to access your Intercore account." 
            : "Please provide your shipping and account details for an exclusive purchasing experience."}
        </p>

        <div className="bg-white py-8 px-4 border border-zinc-100 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleAuth}>
            
            {/* CONDITIONAL REGISTRATION FIELDS */}
            {!isLogin && (
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 pb-6 border-b border-zinc-50 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    placeholder="Vedant..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required={!isLogin}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    placeholder="+91..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Home Address</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">City</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    placeholder="Pune"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Postal Code</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    placeholder="411057"
                  />
                </div>
              </div>
            )}

            {/* ALWAYS VISIBLE FIELDS (Email & Password) */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                placeholder="studio@intercore.com"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none border-b border-zinc-200 bg-transparent px-0 py-2 text-zinc-900 placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-light">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                // Optional: Clear forms when switching
              }}
              className="text-[11px] uppercase tracking-widest font-medium text-zinc-400 hover:text-zinc-900 transition-colors border-b border-transparent hover:border-zinc-900 pb-1"
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}