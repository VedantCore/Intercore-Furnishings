import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="max-w-3xl mb-24 lg:mb-32">
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 mb-6 leading-tight">
          Shaping the modern architectural narrative.
        </h1>
        <p className="text-lg font-light text-zinc-500 leading-relaxed">
          Intercore was founded on a singular principle: that furniture should not merely fill a room, but actively elevate the architecture that surrounds it. We design uncompromising pieces for the modern purist.
        </p>
      </div>

      {/* Philosophy & Craftsmanship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24 lg:mb-32">
        
        {/* Abstract Brand Image Placeholder */}
        <div className="aspect-[4/5] relative bg-zinc-50 rounded-sm overflow-hidden flex items-center justify-center">
           <span className="text-zinc-400 text-[10px] tracking-widest uppercase font-medium">
             Brand Imagery
           </span>
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-medium tracking-tight text-zinc-900 mb-6">Our Philosophy</h2>
          <p className="text-sm font-light text-zinc-600 leading-relaxed mb-6">
            Every piece in our collection is an exercise in restraint. We strip away the superfluous, leaving only what is essential. The result is a collection of timeless forms, crafted from the finest materials, designed to outlast passing trends.
          </p>
          <p className="text-sm font-light text-zinc-600 leading-relaxed mb-8">
            We partner closely with master artisans and sustainable mills to source premium ash, solid oak, and cold-rolled steel. Our commitment to material integrity ensures that every piece ages gracefully, acquiring a patina that tells the story of its environment.
          </p>
          
          <div className="border-l border-zinc-200 pl-6 my-4">
            <p className="text-sm font-medium text-zinc-900 italic">
              "Design is not just what it looks like and feels like. Design is how it works within the space."
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center border-t border-zinc-100 pt-24">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-900 mb-6">Experience the Collection</h2>
        <Link 
          href="/catalog" 
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs uppercase tracking-widest font-medium hover:bg-zinc-800 transition-colors group"
        >
          Explore Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
    </div>
  );
}