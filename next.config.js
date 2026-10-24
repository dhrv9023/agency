const fs = require('fs');
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Load canonical security and cache headers from single source of truth
const securityHeadersConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'templates', 'security-headers.json'), 'utf8')
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
  async headers() {
    return securityHeadersConfig.routeRules || [];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
