import type { NextConfig } from "next"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/mkt"

const nextConfig: NextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingRoot: __dirname,
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
