import fs from "node:fs";
import { createRequire } from "node:module";
import { plugin } from "@cypress/grep/plugin";
import { defineConfig } from "cypress";

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
};

/**
 * Absolute path to the WebQualityAnalyzer browser bundle, resolved here in Node because a
 * spec runs in the browser and has no module resolution of its own. Letting npm decide where
 * the package lives means a hoisted or nested install both work — hardcoding
 * `node_modules/webqualityanalyzer/...` would break the moment the tree changes shape.
 *
 * `require.resolve` does not exist in an ES module and this project is `"type": "module"`,
 * hence `createRequire`.
 */
const wqaBundlePath = createRequire(import.meta.url).resolve(
  "webqualityanalyzer/wqa.js"
);

export default defineConfig({
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
    wqaBundlePath,
  },
  e2e: {
    baseUrl: "https://adrianjiga.github.io",

    setupNodeEvents(on, config) {
      plugin(config);

      const viewportName = config.expose?.viewport as
        | "mobile"
        | "tablet"
        | "desktop"
        | undefined;
      if (
        viewportName === "mobile" ||
        viewportName === "tablet" ||
        viewportName === "desktop"
      ) {
        config.viewportWidth = viewports[viewportName].width;
        config.viewportHeight = viewports[viewportName].height;
        console.log(`Using viewport: ${viewportName}`);
      }

      on("after:spec", (spec, results) => {
        if (results && results.stats.failures === 0 && results.video) {
          try {
            fs.unlinkSync(String(results.video));
            console.log(`Deleted video for passing spec: ${spec.name}`);
          } catch (err) {
            console.warn(
              `Could not delete video: ${
                err instanceof Error ? err.message : String(err)
              }`
            );
          }
        }
      });

      return config;
    },

    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    experimentalRunAllSpecs: true,
  },
});
