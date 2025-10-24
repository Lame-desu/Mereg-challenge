/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/upload", destination: "http://localhost:3001/upload" },
      {
        source: "/results/:path*",
        destination: "http://localhost:3001/results/:path*",
      },
    ];
  },
};

export default nextConfig;
