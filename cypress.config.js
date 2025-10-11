import { defineConfig } from "cypress";
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
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
      cypressGrepPlugin(config);

      return config;
    },
  },
});
