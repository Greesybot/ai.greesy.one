/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    esmExternals: "loose", // <-- add this
    serverComponentsExternalPackages: ["mongoose"] // <-- and this
  },
  // and the following to enable top-level await support for Webpack
  resolve: {
    alias: {
      '@/': './',
  },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol:"https",
        hostname:"raw.githubusercontent.com",
        port:"",
        pathname:"/**",
      }
    ],
  },
};

export default nextConfig;
