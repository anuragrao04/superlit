/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backendi/:path*",
        destination: "http://10.3.32.54:6969/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
