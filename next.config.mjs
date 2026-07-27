const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://vehicle-rental-system-back-end.vercel.app/api/v1/:path*", // Your backend URL
      },
    ];
  },
};
export default nextConfig;
