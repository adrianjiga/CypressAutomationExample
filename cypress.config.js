import { defineConfig } from "cypress";
import { plugin } from '@cypress/grep/plugin';

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    baseUrl: "https://demoqa.com",
    setupNodeEvents(on, config) {

      // Initialize grep plugin with updated config
      plugin(config);

      return config;
    },
  },
});
