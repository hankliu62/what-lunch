import { UserConfig, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const config: UserConfig = {
  plugins: [vue()],

  define: {
    "process.env": {
      ROUTE_PREFIX: "",
    },
  },
};

// 是否通过github actions部署
const isGithubActions = process.env.GITHUB_ACTIONS || false;

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");
  // 用于为静态资源（如图像、样式表、JavaScript 文件等）设置 URL 前缀
  // 这在将应用部署到自定义域名或 CDN 上时特别有用，因为它允许您将静态资源存储在不同的位置
  config.base = `/${repo}/`;
  config.define["process.env"]["ROUTE_PREFIX"] = `/${repo}`;

  console.log("nextConfig:", config);
}

// https://vitejs.dev/config/
export default defineConfig(config);
