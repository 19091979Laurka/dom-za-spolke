import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.cursor.com",
    "*.cursor.sh",
    "*.vercel.app",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ksiegowoscplock.pl",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
