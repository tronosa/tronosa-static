import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { getEnvironment } from "./src/lib/environment";
import { getSecurityHeaders } from "./src/lib/security/headers";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],

  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",

    deviceSizes: [360, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1600, 1920],

    imageSizes: [48, 64, 96, 128, 160, 192, 256, 320],

    qualities: [60, 65, 70, 75, 80],
  },

  async headers() {
    const { isIndexable } = getEnvironment();

    return [
      {
        source: "/:path*",
        headers: [
          ...getSecurityHeaders(),

          ...(!isIndexable
            ? [
                {
                  key: "X-Robots-Tag",
                  value: "noindex, nofollow, noarchive",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
