import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
// import { supabase } from "@/lib/supabase"; // For when you connect your database

export default async function ProductPage({ params }: { params: { id: string } }) {
  // --- DATABASE FETCH (Commented out for testing) ---
  // const { data: product, error } = await supabase
  //   .from('products')
  //   .select('*')
  //   .eq('id', params.id)
  //   .single();
  //
  // if (!product) return <div>Product not found</div>;

  // --- MOCK PRODUCT (Remove once DB is connected) ---
  const product = {
    id: params.id,
    name: "The Minimalist Lounge",
    price: 12500,
    description: "Crafted with uncompromising precision, this lounge chair features an ash wood frame and premium linen upholstery. Designed for both aesthetic appeal and ergonomic comfort, it serves as the perfect centerpiece for a modern architectural space.",
    details: [
      "Solid ash wood frame with walnut finish",
      "High-density foam cushion",
      "Premium linen blend fabric",
      "Hand-finished joinery"
    ],
    dimensions: "W: 85cm × D: 90cm × H: 75cm"
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Navigation */}
      <Link 
        href="/catalog" 
        className="inline-flex items-center text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-12 transition-colors group"
      >
        <ArrowLeft className="w-3 h-3 mr-3 group-hover:-translate-x-1 transition-transform" /> 
        Back to Catalog
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full aspect-square bg-zinc-100 rounded-sm flex items-center justify-center mb-10 lg:mb-0">
          {/* Replace this div with an actual <img /> or Next.js <Image /> component */}
          <span className="text-zinc-400 text-sm tracking-widest uppercase font-light">Image Placeholder</span>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-4">
            {product.name}
          </h1>
          <p className="text-xl font-light text-zinc-900 mb-8">
            ₹{product.price.toLocaleString()}
          </p>

          <div className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Description</h2>
            <p className="text-sm font-light text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Specifications</h2>
            <ul className="space-y-3">
              {product.details.map((detail, index) => (
                <li key={index} className="flex items-start text-sm font-light text-zinc-600">
                  <Check className="w-4 h-4 mr-3 text-zinc-300 flex-shrink-0 mt-[2px]" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12 border-t border-b border-zinc-100 py-6">
            <div className="flex justify-between items-center text-sm">
              <span className="uppercase tracking-widest text-xs text-zinc-500">Dimensions</span>
              <span className="font-light text-zinc-900">{product.dimensions}</span>
            </div>
          </div>

          {/* The magical button! 
            When clicked, it adds this specific object to Zustand and pops the sidebar open.
          */}
          <AddToCartButton 
            product={{
              id: product.id,
              name: product.name,
              price: product.price
            }} 
          />

          <div className="mt-8 flex items-center justify-center space-x-6 text-xs uppercase tracking-widest text-zinc-400">
            <span>Free Shipping</span>
            <span>•</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}