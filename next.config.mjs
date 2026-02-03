import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    // Fix: @ant-design/cssinjs calls __webpack_require__.hmd which Next.js does not provide.
    // Replace useHMR with a noop stub to avoid "hmd is not a function" at runtime.
    const stubPath = path.resolve(__dirname, 'src/lib/stub-useHMR.js')
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /[\\/]@ant-design[\\/]cssinjs[\\/].*[\\/]useHMR(\.js|\.mjs|\.ts|\.tsx)?$/,
        stubPath
      )
    )
    return config
  },
}

export default nextConfig
