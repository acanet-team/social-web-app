/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import withBundleAnalyzer from "@next/bundle-analyzer";
import withNextIntl from "next-intl/plugin";
import path, { dirname } from "path";
// Import the path module for directory manipulation
const __dirname = dirname(new URL(import.meta.url).pathname);

const withNextIntlConfig = withNextIntl("./src/libs/i18n.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntlConfig({
    eslint: {
      dirs: ["."],
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    poweredByHeader: false,
    reactStrictMode: false,
    experimental: {
      serverComponentsExternalPackages: ["@electric-sql/pglite"],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, "./src/styles/global.scss")],
    },
    images: {
      domains: [
        "via.placeholder.com",
        "lh3.googleusercontent.com",
        "acanet-v1-public-test.s3.amazonaws.com",
      ],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
  }),
);
