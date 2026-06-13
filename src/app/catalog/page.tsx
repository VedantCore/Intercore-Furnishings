"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Loader2, SlidersHorizontal, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
}

const CATEGORIES = ["All", "Seating", "Tables", "Storage", "Lighting", "Decor"];
type SortOption = "newest" | "price-asc" | "price-desc";

// 1. We extract the active logic into its own component so it can safely read search parameters
function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Read the active filters directly from the URL
  const currentCategory = searchParams.get("category") || "All";
  const currentSort = (searchParams.get("sort") as SortOption) || "newest";

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setProducts(data);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Helper function to update the URL without refreshing the page
  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Keep URLs clean: Remove the parameter entirely if "All" is selected
    if (value === "All" && name === "category") {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    // Push the new URL, but prevent the page from scrolling to the top
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Derive what to show instantly on render
  let displayProducts = [...products];
  
  if (currentCategory !== "All") {
    displayProducts = displayProducts.filter(
      (p) => p.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }
  
  switch (currentSort) {
    case "price-asc":
      displayProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      displayProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      displayProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <>
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-zinc-100 pb-8">
        
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400 mr-2 hidden sm:flex">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => updateFilter("category", category)}
              className={`text-xs uppercase tracking-widest transition-colors ${
                currentCategory === category 
                  ? "text-black font-medium border-b border-black pb-1" 
                  : "text-zinc-400 hover:text-zinc-900 pb-1"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
          >
            Sort By: {currentSort === 'newest' ? 'Newest' : currentSort === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
            <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 shadow-sm z-10 py-2">
              <button 
                onClick={() => { updateFilter("sort", "newest"); setIsSortOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
              >
                Newest Arrivals
              </button>
              <button 
                onClick={() => { updateFilter("sort", "price-asc"); setIsSortOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
              >
                Price: Low to High
              </button>
              <button 
                onClick={() => { updateFilter("sort", "price-desc"); setIsSortOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
              >
                Price: High to Low
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {displayProducts.length === 0 ? (
        <div className="text-center py-24 bg-zinc-50 rounded-sm">
          <p className="text-zinc-500 font-light">No products found for these filters.</p>
          <button 
            onClick={() => { updateFilter("category", "All"); updateFilter("sort", "newest"); }}
            className="mt-4 text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {displayProducts.map((product) => (
            <Link key={product.id} href={`/catalog/${product.id}`} className="group block">
              <div className="relative aspect-[4/5] bg-zinc-50 mb-6 overflow-hidden rounded-sm">
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-300">
                    Image Pending
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-zinc-400">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-zinc-900">₹{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

// 2. The main page component wraps everything in a React Suspense boundary
export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-4">The Collection</h1>
        <p className="text-sm font-light text-zinc-500 max-w-xl leading-relaxed">
          Explore our complete range of architectural furniture. Filter by category to find pieces designed specifically for your environment.
        </p>
      </div>

      <Suspense fallback={
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </div>
  );
}