import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["api-assets.clashroyale.com"],
  },
  async rewrites() {
    return [
      {
        source: "/@:username",
        destination: "/user/:username",
      },
    ];
  },
};

export default nextConfig;
