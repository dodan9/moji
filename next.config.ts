import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // 브라우저용 소스맵 비활성화
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.devtool = false; // 클라이언트용 소스맵 제거
    }
    return config;
  },
};

export default nextConfig;
