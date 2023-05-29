const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  distDir: 'build',
  experimental: {
    esmExternals: false,
    jsconfigPaths: true,
    optimizeCss: true, // Optional: If you use CSS
    optimizeImages: true, // Optional: If you use images
    workerThreads: true, // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
