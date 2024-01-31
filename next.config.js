/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nadena-s3.s3.me-central-1.amazonaws.com',
        port: ''
        // pathname: '/account123/**',
      }
    ]
  }
};

module.exports = nextConfig;
