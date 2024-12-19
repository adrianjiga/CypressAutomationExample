import { defineConfig } from "cypress";
import grepPlugin from "@cypress/grep/src/plugin.js";

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  retries: 2,
  e2e: {
    baseUrl: "https://demoqa.com",
    setupNodeEvents(on, config) {
      // Set env variables before initializing the grep plugin
      config.env = {
        ...config.env,
        grepFilterSpecs: true,
        grepOmitFiltered: true,
      };

      // Initialize grep plugin with updated config
      grepPlugin(config);

      return config;
    },
  },
});
