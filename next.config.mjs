/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false // Disable CSS optimization that might use lightningcss
  }
};

export default nextConfig;
