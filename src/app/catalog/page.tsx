import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";

// Forces Next.js to always fetch the freshest inventory from Supabase
export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  // --- REAL DATABASE FETCH ---
  // Fetch all products, ordered by the newest additions first
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 font-light text-sm tracking-widest uppercase">
          Unable to load the collection.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-16 border-b border-zinc-100 pb-8">
        <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-4">
          The Collection
        </h1>
        <p className="text-sm font-light text-zinc-500 max-w-2xl leading-relaxed">
          Explore our curated selection of premium architectural furniture. Each piece is designed with uncompromising precision and crafted to elevate your living space.
        </p>
      </div>

      {/* Product Grid */}
      {products?.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-zinc-500 font-light">No pieces are currently available in the collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products?.map((product) => (
            <div key={product.id} className="group flex flex-col">
              
              {/* Product Image Link */}
              <Link href={`/catalog/${product.id}`} className="block mb-6 relative group overflow-hidden rounded-sm">
                <div className="w-full aspect-[4/5] relative bg-zinc-50">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                      <span className="text-zinc-400 text-[10px] tracking-widest uppercase font-medium">Image Pending</span>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Product Info */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <Link href={`/catalog/${product.id}`} className="hover:text-zinc-500 transition-colors">
                    <h2 className="text-sm font-medium text-zinc-900 pr-4">{product.name}</h2>
                  </Link>
                  <p className="text-sm font-light text-zinc-900 flex-shrink-0">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
                
                {/* Quick Add to Cart */}
                <div className="mt-auto">
                  <AddToCartButton 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price
                    }} 
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}