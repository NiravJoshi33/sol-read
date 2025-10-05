import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// for shadcn: https://github.com/wxt-dev/examples/tree/main/examples/react-shadcn

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage", "tabs", "activeTab"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      "@": path.resolve(__dirname, "./"),
    },
  }),
});
