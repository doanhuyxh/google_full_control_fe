import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  trailingSlash: false,
  basePath: "",
  assetPrefix: "",
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.sanity.io",
      "res.cloudinary.com",
      "media.graphassets.com",
      "media.graphcms.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "www.gravatar.com",
      "tailwindui.com",
      "dummyimage.com",
      "placehold.co"
    ],
  },
  turbopack: {
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
  }
};

export default nextConfig;
