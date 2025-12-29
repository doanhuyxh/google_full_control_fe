import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  trailingSlash: false,
  basePath: "",
  assetPrefix: "",
  output: "standalone", // Required for Docker deployment
  turbopack: {
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
  }
};

export default nextConfig;
