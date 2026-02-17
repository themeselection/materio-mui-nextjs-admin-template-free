/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  env: {
    NEXT_PUBLIC_PRO_URL: process.env.NEXT_PUBLIC_PRO_URL || 'https://themeselection.com',
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL || 'https://demos.themeselection.com',
  NEXT_PUBLIC_REPO_NAME: process.env.NEXT_PUBLIC_REPO_NAME || 'materio-mui-react-nextjs-admin-template-free',
  NEXT_PUBLIC_BASE_PATH: process.env.BASEPATH || '',
  // プロキシ環境での外部フォント取得を抑止（必要時は true を明示設定）
  NEXT_PUBLIC_ENABLE_GOOGLE_FONTS: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_FONTS || 'false'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://10.100.54.170:3000/api/:path*'
        destination: 'http://localhost:3001/api/:path*'
      }
    ]
  }
  // NOTE: experimental.suppressDeprecationWarnings は Next.js 14 では無効なため削除しました。
  // Node の DeprecationWarning を抑止したい場合は既に package.json の dev スクリプトで
  // NODE_OPTIONS=--no-deprecation を付けているので追加対応不要です。
}

export default nextConfig
