const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n.ts");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const apiPort = process.env.API_PORT || "8000";
    return [
      {
        source: "/api/:path*",
        destination: `http://127.0.0.1:${apiPort}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `http://127.0.0.1:${apiPort}/uploads/:path*`,
      },
    ];
  },
};

module.exports = withPWA(withNextIntl(nextConfig));
