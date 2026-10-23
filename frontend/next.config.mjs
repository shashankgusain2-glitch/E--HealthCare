// Where the backend API server runs. Every /api/* request is forwarded there, so the
// browser only ever talks to this app's origin and NextAuth session cookies keep working.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
