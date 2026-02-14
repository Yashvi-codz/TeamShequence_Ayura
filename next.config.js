// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_FOODOSCOPE_API_BASE: process.env.NEXT_PUBLIC_FOODOSCOPE_API_BASE,
    NEXT_PUBLIC_FOODOSCOPE_API_KEY: process.env.NEXT_PUBLIC_FOODOSCOPE_API_KEY,
  },
};

module.exports = nextConfig;
