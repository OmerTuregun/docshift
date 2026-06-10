import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  serverExternalPackages: [
    "bcryptjs",
    "pg",
    "@auth/pg-adapter",
    "pdf-parse",
    "pptx2json",
    "mammoth",
    "xlsx",
  ],
  experimental: {
    optimizePackageImports: ["react-icons/tb", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
