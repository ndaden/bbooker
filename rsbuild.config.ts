import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const rsbuildConfig = defineConfig({
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
  source: {
    define: {
      "process.env.PUBLIC_API_URL":
        process.env.NODE_ENV === "development"
          ? JSON.stringify(process.env.PUBLIC_DEV_API_URL)
          : JSON.stringify(process.env.PUBLIC_API_URL),
    },
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
console.log("rsbuild config : ", rsbuildConfig.source?.define);

export default rsbuildConfig;
