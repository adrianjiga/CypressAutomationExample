/* eslint-disable no-undef */
import { defineConfig } from "cypress";
import { plugin } from "@cypress/grep/plugin";
import fs from "fs";

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
};

export default defineConfig({
  allowCypressEnv: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  video: true,
  videoCompression: 32,
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "reports",
    overwrite: false,
    html: true,
    json: true,
    reportFilename: "[status]_[datetime]-[name]-report",
    timestamp: "yyyy-mm-dd_HH-MM-ss",
  },
  expose: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    viewports: viewports,
  },
  e2e: {
    baseUrl: "https://adrianjiga.github.io",

    setupNodeEvents(on, config) {
      plugin(config);

      const viewportName = config.expose && config.expose.viewport;
      if (viewportName && viewports[viewportName]) {
        config.viewportWidth = viewports[viewportName].width;
        config.viewportHeight = viewports[viewportName].height;
        console.log(`Using viewport: ${viewportName}`);
      }

      on("after:spec", (spec, results) => {
        if (results && results.stats.failures === 0 && results.video) {
          try {
            fs.unlinkSync(results.video);
            console.log(`Deleted video for passing spec: ${spec.name}`);
          } catch (err) {
            console.warn(`Could not delete video: ${err.message}`);
          }
        }
      });

      return config;
    },

    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    experimentalRunAllSpecs: true,
  },
});
