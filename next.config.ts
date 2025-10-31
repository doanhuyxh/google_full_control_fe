import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  trailingSlash: false,
  basePath: "",
  assetPrefix: "",
  turbopack: {
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
  }
};

export default nextConfig;
