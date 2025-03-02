/* eslint-disable @typescript-eslint/no-explicit-any */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  // Add this to ensure proper handling of static files
  webpack: (config: any) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
