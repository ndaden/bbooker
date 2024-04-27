import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';
import * as fs from "node:fs";

const rsbuildConfig = defineConfig({
  plugins: [pluginReact(),pluginBasicSsl()],
  dev: {
    writeToDisk: false,
  },
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync('certs/cert.key'),
      cert: fs.readFileSync('certs/cert.crt'),
    },
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
console.log("rsbuild config : ", rsbuildConfig.source?.define);

export default rsbuildConfig;
