import { supabase } from "../../lib/supabase";
import Link from "next/link";

export const revalidate = 0; 

export default async function CatalogPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error:", error); // Logs to your terminal
    return (
      <div className="container mx-auto px-6 py-32 text-center text-red-500 font-light">
        <p>Failed to load the collection. Please try again.</p>
        <p className="text-sm mt-4 text-zinc-500">Developer Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200/50 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 mb-4">The Collection</h1>
          <p className="text-zinc-500 font-light text-lg">Curated essentials for the modern home.</p>
        </div>
        <div className="text-[12px] uppercase tracking-widest text-zinc-400 mt-6 md:mt-0">
          Showing {products?.length} pieces
        </div>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {products?.map((product) => (
          <Link href={`/catalog/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
            {/* Image Container with subtle gray backdrop */}
            <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-6 relative">
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            
            {/* Typography */}
            <div className="flex flex-col flex-1">
              <p className="text-[11px] uppercase tracking-widest text-zinc-400 mb-2">{product.category}</p>
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-medium text-lg tracking-tight text-zinc-900 leading-snug">
                  {product.name}
                </h3>
                <p className="font-light text-zinc-500 whitespace-nowrap">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}