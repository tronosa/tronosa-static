import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { getEnvironment } from "./src/lib/environment";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],

  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    qualities: [75, 80],
  },

  async headers() {
    const { isIndexable } = getEnvironment();

    if (isIndexable) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
