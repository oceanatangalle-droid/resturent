import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },

  // Smaller client bundles and faster loads
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  webpack: (config, { webpack }) => {
    // Fix for @ant-design/cssinjs
    const stubPath = path.resolve(__dirname, 'src/lib/stub-useHMR.js')
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /[\\/]@ant-design[\\/]cssinjs[\\/].*[\\/]useHMR(\.js|\.mjs|\.ts|\.tsx)?$/,
        stubPath
      )
    )
    return config
  },

  // Image optimization
  images: {
    domains: ['img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
