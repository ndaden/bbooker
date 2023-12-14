import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  dev: {
    writeToDisk: false,
  },
  server: {
    port: 3000,
    publicDir: {
      name: "public",
    },
  },
  html: {
    template: "./template/index.html",
  },
  output: {
    distPath: {
      root: "./build",
      html: "",
      css: "",
      js: "",
      image: "",
    },
  },
});
