import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Secures and allows your Supabase storage URLs
      },
    ],
  },
};

export default nextConfig;