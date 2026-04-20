/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@freightiq/db",
    "@freightiq/env",
    "@freightiq/core",
    "@freightiq/adapters",
  ],
};

module.exports = nextConfig;
