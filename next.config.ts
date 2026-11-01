import type { NextConfig } from 'next';

// CLOUDINARY_URL looks like cloudinary://<key>:<secret>@<cloud_name>; only the cloud name is used here.
const cloudName = process.env.CLOUDINARY_URL?.split('@')[1]?.split(/[/?]/)[0];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: cloudName ? `/${cloudName}/**` : '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      // Photos are downsized in the browser (max 4 MB); the default 1 MB limit would reject them.
      bodySizeLimit: '5mb',
    },
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
