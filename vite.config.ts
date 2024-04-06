import { UserConfig, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autobase from "vite-plugin-autobase";

const config: UserConfig = {
  plugins: [vue(), autobase()],

  define: {
    "process.env": {
      ROUTE_PREFIX: "",
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);
