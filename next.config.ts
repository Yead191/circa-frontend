/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.10.7.48',
        port: '5000',
        pathname: '/**',  // optional but good to have
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.48",
      },
    ],
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development' ? true : false,  // ← Correct: top-level under images
  },

  experimental: {
    serverSourceMaps: false, // ✅ Fixes invalid source map error
    serverActions: {
      // Increase the maximum request body size
      bodySizeLimit: "20mb",
    },

  },
  //  allowedDevOrigins: [
  //   "http://localhost",
  //   "http://127.0.0.1",
  //   "http://0.0.0.0",
  //   "http://172.21.240.1",
  //   "http://172.21.x.x",
  // ],

  eslint: {
    ignoreDuringBuilds: true, // 🚀 skips ESLint during build
  },

};

export default nextConfig;
