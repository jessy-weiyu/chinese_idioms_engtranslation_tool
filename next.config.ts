import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "chinese_idioms_engtranslation_tool";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? `/${repositoryName}` : "",
  assetPrefix: isGitHubPages ? `/${repositoryName}/` : "",
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
