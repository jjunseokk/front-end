/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['ttarum-bucket.s3.ap-northeast-2.amazonaws.com'],
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ]
  },
  reactStrictMode: true,
  include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', 'global.d.ts'],
  compilerOptions: {
    "noUncheckedSideEffectImports": true
  }
};

module.exports = nextConfig;
