/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mamnzhmusnsbeuelpgnz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // This restricts it specifically to your public storage
      },
    ],
  },
};

module.exports = nextConfig;