import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hero image is embedded as data URI — no remote domains needed yet.
  // When you move to Cloudinary, add it here:
  // images: {
  //   remotePatterns: [{ protocol:"https", hostname:"res.cloudinary.com" }]
  // }
};

export default nextConfig;

