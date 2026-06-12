import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductReviews from "@/components/ProductReviews";
import { supabase } from "@/lib/supabase"; 

export default async function ProductPage({ params }: { params: { id: string } }) {
  // --- REAL DATABASE FETCH ---
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product || error) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Product not found</div>;

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/catalog" className="inline-flex items-center text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-12 transition-colors group">
        <ArrowLeft className="w-3 h-3 mr-3 group-hover:-translate-x-1 transition-transform" /> 
        Back to Catalog
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">
        
        {/* Left Column: Image */}
        <div className="w-full aspect-square bg-zinc-100 rounded-sm flex items-center justify-center mb-10 lg:mb-0">
          <span className="text-zinc-400 text-sm tracking-widest uppercase font-light">Image Placeholder</span>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-4">{product.name}</h1>
          <p className="text-xl font-light text-zinc-900 mb-8">₹{product.price.toLocaleString()}</p>

          <div className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Description</h2>
            <p className="text-sm font-light text-zinc-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-12 border-t border-b border-zinc-100 py-6">
            <div className="flex justify-between items-center text-sm">
              <span className="uppercase tracking-widest text-xs text-zinc-500">Dimensions</span>
              <span className="font-light text-zinc-900">{product.dimensions}</span>
            </div>
          </div>

          {/* The Add to Cart Button hooked to Zustand */}
          <AddToCartButton product={{ id: product.id, name: product.name, price: product.price }} />

          {/* THE NEW REVIEWS SECTION */}
          <ProductReviews productId={product.id} />
          
        </div>
      </div>
    </div>
  );
}