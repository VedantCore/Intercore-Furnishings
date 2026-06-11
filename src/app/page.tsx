"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Optional: Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-100 rounded-full blur-3xl -z-10 opacity-50" />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        className="max-w-4xl"
      >
        <motion.p variants={fadeUp} className="text-[13px] uppercase tracking-[0.3em] text-zinc-500 mb-6 font-medium">
          The 2026 Collection
        </motion.p>
        
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
          Elevate your space with <span className="text-zinc-400 italic font-light">mindful</span> design.
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Discover our curated collection of premium, modern furniture designed to seamlessly integrate into your daily life.
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/catalog" 
            className="group relative px-8 py-4 bg-zinc-900 text-white rounded-full overflow-hidden transition-all hover:scale-105"
          >
            <span className="relative z-10 text-sm tracking-widest uppercase font-medium">Shop Collection</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link 
            href="/about" 
            className="text-sm tracking-widest uppercase font-medium text-zinc-500 hover:text-black transition-colors"
          >
            Explore the Studio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}