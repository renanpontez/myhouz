import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@home/auth", "@home/db", "@home/types", "@home/ui"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      // Backwards-compat: old routes → new /app/... routes
      {
        source: "/dashboard",
        destination: "/app/dashboard",
        permanent: true,
      },
      {
        source: "/items/:path*",
        destination: "/app/items/:path*",
        permanent: true,
      },
      {
        source: "/routines/:path*",
        destination: "/app/routines/:path*",
        permanent: true,
      },
      {
        source: "/reminders/:path*",
        destination: "/app/reminders/:path*",
        permanent: true,
      },
      {
        source: "/urgent/:path*",
        destination: "/app/urgent/:path*",
        permanent: true,
      },
      {
        source: "/members/:path*",
        destination: "/app/members/:path*",
        permanent: true,
      },
      {
        source: "/settings/:path*",
        destination: "/app/settings/:path*",
        permanent: true,
      },
      {
        source: "/onboarding/:path*",
        destination: "/app/onboarding/:path*",
        permanent: true,
      },
      {
        source: "/landing",
        destination: "/",
        permanent: true,
      },
    ];
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
