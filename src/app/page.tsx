"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

  return (
    <div className="bg-[#F8F6F2] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col overflow-hidden"
      >
        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute top-24 right-8 md:right-16 z-10 flex flex-col items-end gap-1"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#8C7B6B]">Est. 2019</span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C7B6B]">Collection 2026</span>
        </motion.div>

        {/* Stacked display type — the signature element */}
        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-center pl-4 md:pl-14 pt-20 select-none pointer-events-none z-0"
        >
          {[
            { word: "ELITE", outlined: false },
            { word: "PRESTIGIOUS", outlined: false },
            { word: "LUXURY.", outlined: true },
          ].map(({ word, outlined }, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.18, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="block font-bold italic leading-none"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(4.5rem, 14vw, 25rem)",
                lineHeight: 0.87,
                color: outlined ? "transparent" : "#1A1A18",
                WebkitTextStroke: outlined ? "1.5px #8C7B6B" : undefined,
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Right-side descriptor + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-auto ml-auto mr-6 md:mr-16 mb-14 md:mb-20 max-w-[260px] text-right flex flex-col items-end gap-7"
        >
          <p className="text-[12px] leading-relaxed text-[#8C7B6B] font-light tracking-wide">
            Objects designed for those who<br />
            choose environment over ornament.
          </p>

          <div className="flex flex-col items-end gap-3.5">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-3.5 bg-[#1A1A18] text-[#F8F6F2] px-7 py-3.5 text-[10px] tracking-[0.32em] uppercase font-medium hover:bg-[#2C2C28] transition-colors duration-300"
            >
              Enter the Studio
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/about"
              className="text-[10px] tracking-[0.25em] uppercase text-[#8C7B6B] hover:text-[#1A1A18] transition-colors duration-300 border-b border-[#D4C9BB] pb-0.5 hover:border-[#1A1A18]"
            >
              Our philosophy
            </Link>
          </div>
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.3, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
          className="absolute bottom-0 left-0 right-0 h-px bg-[#D4C9BB]"
        />
      </section>

      {/* ── MATERIALS STRIP ──────────────────────────────── */}
      <section className="border-b border-[#D4C9BB]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-3 divide-x divide-[#D4C9BB]"
        >
          {[
            { label: "Material", value: "Solid White Oak\n& Cold-Rolled Steel" },
            { label: "Origin", value: "Atelier-made\nin Northern Europe" },
            { label: "Guarantee", value: "Lifetime structural\nwarranty" },
          ].map(({ label, value }) => (
            <div key={label} className="py-9 px-6 md:px-12 first:pl-0 last:pr-0">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#8C7B6B] mb-3">{label}</p>
              <p
                className="text-[14px] leading-snug text-[#1A1A18] whitespace-pre-line"
                style={{ fontFamily: SERIF }}
              >
                {value}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────── */}
      <section className="border-t border-[#D4C9BB]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 md:px-16 py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-10"
        >
          <div className="md:col-span-4 pt-1.5">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#8C7B6B]">
              Why Choose Intercore
            </span>
          </div>

          <div className="md:col-span-8">
            <blockquote
              className="text-[1.6rem] md:text-[2rem] font-normal italic leading-snug text-[#1A1A18] mb-9"
              style={{ fontFamily: SERIF }}
            >
              "We do not design for trend.<br />
              We design for the rooms that<br />
              outlast every season."
            </blockquote>
            <p className="text-[13px] leading-relaxed text-[#8C7B6B] font-light max-w-md tracking-wide mb-9">
              Each piece is an argument against excess. We work with master craftsmen across Scandinavia and Central Europe to produce furniture that earns its place — not through spectacle, but through silence.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-[#1A1A18] border-b border-[#1A1A18] pb-0.5 hover:text-[#8C7B6B] hover:border-[#8C7B6B] transition-colors duration-300"
            >
              Read the manifesto →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── DARK FOOTER CTA ───────────────────────────────── */}
      <section className="border-t border-[#D4C9BB] bg-[#1A1A18]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 md:px-16 py-20 md:py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-10"
        >
          <div>
            <p className="text-[10px] tracking-[0.38em] uppercase text-[#8C7B6B] mb-5">
              Private Appointments Available <br />
              White-glove delivery above ₹5,00,000
            </p>
            <h2
              className="text-[1.8rem] md:text-[2.25rem] italic font-normal text-[#F8F6F2] leading-snug"
              style={{ fontFamily: SERIF }}
            >
              The studio is open<br />by arrangement.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-4 border border-[#F8F6F2]/25 text-[#F8F6F2] px-8 py-4 text-[10px] tracking-[0.32em] uppercase font-medium hover:bg-[#F8F6F2] hover:text-[#1A1A18] transition-all duration-300"
            >
              Enter the Collection
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <span className="text-[10px] tracking-[0.22em] text-[#8C7B6B]">
              @ 2026 Intercore Furnishings. All rights reserved.
            </span>
          </div>
        </motion.div>
      </section>

    </div>
  );
}