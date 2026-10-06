import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker uchun minimal, mustaqil server (server.js) yig'iladi
  output: "standalone",
  poweredByHeader: false,
  // Repo ildizida boshqa loyiha bor; shu papkani alohida ildiz sifatida belgilaymiz
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
