/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    appDir: false,
  },
  webpack: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      },
    },
  })
}

module.exports = nextConfig
