"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen pt-32 pb-0 px-0"
      style={{ backgroundColor: "#F8F6F2", color: "#1A1A18" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* ── HERO TEXT ─────────────────────────────────────── */}
        <div className="max-w-2xl mb-20 md:mb-28">
          <p
            className="text-[10px] tracking-[0.38em] uppercase mb-6"
            style={{ color: "#8C7B6B" }}
          >
            About Intercore
          </p>
          <h1
            className="text-4xl md:text-[3.25rem] font-bold italic leading-[1.08] tracking-tight mb-7"
            style={{ fontFamily: SERIF, color: "#1A1A18" }}
          >
            Shaping the modern<br />architectural narrative.
          </h1>
          <p
            className="text-[14px] leading-relaxed font-light"
            style={{ color: "#8C7B6B" }}
          >
            Intercore was founded on a singular principle: that furniture should not merely fill a room,
            but actively elevate the architecture that surrounds it. We design uncompromising pieces
            for the modern purist.
          </p>
        </div>

      </div>

      {/* ── PAINTING + PHILOSOPHY ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-24 md:mb-36">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">

          {/* Painting column */}
          <div className="md:col-span-6 lg:col-span-7">

            {/* Outer frame — double-border gallery treatment */}
            <div
              className="relative p-[6px]"
              style={{ border: "1px solid #D4C9BB" }}
            >
              <div
                className="relative p-[10px]"
                style={{ border: "1px solid #C4B8A8", backgroundColor: "#EDE9E3" }}
              >
                {/* The painting */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=85&auto=format&fit=crop"
                    alt="Classical dark oil painting — a moody atmospheric landscape in the tradition of the old masters"
                    className="w-full h-full object-cover object-center"
                    style={{ display: "block" }}
                  />

                  {/* Varnish gloss overlay — subtle warm tint to evoke aged canvas */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(180,155,110,0.07) 0%, transparent 60%, rgba(30,20,10,0.12) 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>

                {/* Museum-style caption panel */}
                <div
                  className="mt-0 px-3 py-3 flex items-start justify-between"
                  style={{ borderTop: "1px solid #D4C9BB" }}
                >
                  <div>
                    <p
                      className="text-[11px] italic mb-0.5"
                      style={{ fontFamily: SERIF, color: "#1A1A18" }}
                    >
                      The Weight of Silence
                    </p>
                    <p
                      className="text-[9px] tracking-[0.25em] uppercase"
                      style={{ color: "#8C7B6B" }}
                    >
                      Oil on linen, c. 2021 · Private Collection
                    </p>
                  </div>
                  <p
                    className="text-[9px] tracking-[0.22em] uppercase mt-0.5"
                    style={{ color: "#C4B8A8" }}
                  >
                    I
                  </p>
                </div>
              </div>
            </div>

            {/* Wall shadow — painterly depth illusion */}
            <div
              className="h-3 mx-4"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(26,26,24,0.12) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Philosophy text column */}
          <div
            className="md:col-span-6 lg:col-span-5 flex flex-col justify-center md:pt-10"
          >
            <h2
              className="text-2xl md:text-[1.65rem] font-bold italic leading-snug tracking-tight mb-7"
              style={{ fontFamily: SERIF, color: "#1A1A18" }}
            >
              Our Philosophy
            </h2>

            <p
              className="text-[13px] leading-relaxed font-light mb-5"
              style={{ color: "#8C7B6B" }}
            >
              Every piece in our collection is an exercise in restraint. We strip away the superfluous,
              leaving only what is essential. The result is a collection of timeless forms, crafted from
              the finest materials, designed to outlast passing trends.
            </p>
            <p
              className="text-[13px] leading-relaxed font-light mb-9"
              style={{ color: "#8C7B6B" }}
            >
              We partner closely with master artisans and sustainable mills to source premium ash,
              solid oak, and cold-rolled steel. Our commitment to material integrity ensures that
              every piece ages gracefully, acquiring a patina that tells the story of its environment.
            </p>

            {/* Pull quote — left-rule treatment */}
            <div
              className="pl-6 py-1 mb-10"
              style={{ borderLeft: "1.5px solid #8C7B6B" }}
            >
              <p
                className="text-[14px] italic leading-relaxed font-normal"
                style={{ fontFamily: SERIF, color: "#1A1A18" }}
              >
                "Design is not just what it looks like
                and feels like. Design is how it works
                within the space."
              </p>
            </div>

            {/* Material tokens */}
            <div
              className="grid grid-cols-2 gap-px mb-10"
              style={{ border: "1px solid #D4C9BB" }}
            >
              {[
                { label: "Primary material", value: "Solid White Oak" },
                { label: "Joinery", value: "Hand-cut dovetail" },
                { label: "Surface", value: "Cold-rolled steel" },
                { label: "Finish", value: "Natural beeswax" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="px-4 py-3"
                  style={{ backgroundColor: "#F0EDE7" }}
                >
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase mb-1"
                    style={{ color: "#8C7B6B" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[12px]"
                    style={{ fontFamily: SERIF, color: "#1A1A18" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #D4C9BB", backgroundColor: "#1A1A18" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-20 md:py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <p
              className="text-[10px] tracking-[0.38em] uppercase mb-5"
              style={{ color: "#8C7B6B" }}
            >
              The Collection Awaits
            </p>
            <h2
              className="text-[1.8rem] md:text-[2.2rem] italic font-normal leading-snug"
              style={{ fontFamily: SERIF, color: "#F8F6F2" }}
            >
              Experience the collection<br />in person.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-4 px-8 py-4 text-[10px] tracking-[0.32em] uppercase font-medium transition-all duration-300"
              style={{
                border: "1px solid rgba(248,246,242,0.25)",
                color: "#F8F6F2",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F8F6F2";
                (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "#F8F6F2";
              }}
            >
              Explore Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <span
              className="text-[10px] tracking-[0.22em]"
              style={{ color: "#8C7B6B" }}
            >
              White-glove delivery above ₹5,00,000
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}