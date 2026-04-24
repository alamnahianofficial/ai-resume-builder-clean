/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false, // 👈 VERY IMPORTANT
  },
};

module.exports = nextConfig;
