import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 0;

// NEXT.JS 15 FIX: params is now a Promise that must be awaited
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params before extracting the ID
  const { id } = await params;

  // Fetch the single product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-4">Piece not found.</h1>
        <p className="text-zinc-500 font-light mb-8">This item may have been removed or is no longer available.</p>
        <Link href="/catalog" className="text-[11px] uppercase tracking-widest font-medium text-zinc-900 hover:text-zinc-500 transition-colors border-b border-zinc-900 pb-1">
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <Link href="/catalog" className="inline-flex items-center text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-12 md:mb-16 transition-colors group">
        <ArrowLeft className="w-3 h-3 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Editorial Image Showcase */}
        <div className="aspect-[4/5] bg-[#F5F5F5] overflow-hidden relative">
          <img 
            src={product.image_urls[0]} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        {/* Minimalist Product Information */}
        <div className="flex flex-col justify-center max-w-lg">
          <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-4">{product.category}</p>
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 mb-6 leading-none">
            {product.name}
          </h1>
          <p className="text-2xl font-light text-zinc-900 mb-10">₹{product.price.toLocaleString('en-IN')}</p>
          
          <div className="w-12 h-[1px] bg-zinc-200 mb-10"></div>

          <p className="text-zinc-500 font-light leading-relaxed mb-12 text-[15px]">
            {product.description}
          </p>

          {/* Specs List */}
          <div className="flex flex-col gap-4 mb-12 border-t border-b border-zinc-100 py-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-light">Material</span>
              <span className="font-medium text-zinc-900">{product.material}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-light">Availability</span>
              <span className="font-medium">
                {product.stock > 0 ? (
                  <span className="text-zinc-900">In Stock</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Interactive Zustand Button */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}