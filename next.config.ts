import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (outputs to ./out)
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
