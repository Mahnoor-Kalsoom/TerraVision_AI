import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows blob: object URLs created by URL.createObjectURL()
    // and data: URLs for the mask
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    // Allow unoptimized for blob/data URIs used in preview
    unoptimized: false,
  },
};

export default nextConfig;
