/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Keep your supabase storage domain here if you added it earlier!
    ],
  },
};

export default nextConfig;