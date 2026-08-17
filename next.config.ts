import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for Docker. Vercel traces its own output and fails if this is set.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
