/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    seller: "kccshop",
  },
  experimental: {
    serverComponentsExternalPackages: ['sequelize'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hanoicomputercdn.com",
        port: "",
        pathname: "/media/product/**",
      },
      {
        protocol: "https",
        hostname: "anphat.com.vn",
        port: "",
        pathname: "/media/product/**",
      },
      {
        protocol: "https",
        hostname: "product.hstatic.net",
        port: "",
        pathname: "/200000722513/product/**",
      },
      {
        protocol: "https",
        hostname: "kccshop.vn",
        port: "",
        pathname: "/media/product/**",
      },
      {
        protocol: "https",
        hostname: "kccshop.vn",
        port: "",
        pathname: "/media/banner/**",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
        port: "",
        pathname: "/thumb/medium/100/329/122/products/**",
      },
      {
        protocol: "https",
        hostname: "cdn.tgdd.vn",
        port: "",
        pathname: "/hoi-dap/**",
      },
    ],
  },
}

module.exports = nextConfig