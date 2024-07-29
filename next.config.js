/** @type {import("next").NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '**',
      },
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: [""],
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}