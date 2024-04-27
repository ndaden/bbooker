import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';

const rsbuildConfig = defineConfig({
  plugins: [pluginReact(),pluginBasicSsl()],
  dev: {
    writeToDisk: false,
  },
  source: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL),
      },
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

export default rsbuildConfig;
