import type { NextConfig } from 'next';
const nextConfig: NextConfig = { output: 'export', trailingSlash: true, images: { unoptimized: true }, distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next' };
export default nextConfig;
