import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Domain bawaan dari Uploadthing
      },
    ],
  },
};

export default nextConfig;
