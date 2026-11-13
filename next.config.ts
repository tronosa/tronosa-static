import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",

    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    qualities: [75, 80],
  },
};

export default withNextIntl(nextConfig);
