import { defineConfig } from "cypress";
import { plugin } from '@cypress/grep/plugin';

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'reports',
    overwrite: false,
    html: true,
    json: true,
    reportFilename: '[status]_[datetime]-[name]-report',
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