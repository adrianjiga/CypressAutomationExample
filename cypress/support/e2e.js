// ***********************************************************
// This support file is processed and loaded automatically
// before your test files.
//
// It contains:
// - Custom commands
// - Global configuration
// - Third-party plugin imports
// - Test lifecycle hooks
// ***********************************************************

// Import custom commands
import "./commands";

// Import test data factories (makes them available globally if needed)
import * as factories from "./factories";
Cypress.expose("factories", factories);

// Third-party plugins
import "cypress-plugin-api";
import "cypress-wait-until";

// Cypress Grep plugin for test filtering
import { register } from "@cypress/grep";
register();

// ============================================================
// GLOBAL CONFIGURATION
// ============================================================

// Disable uncaught exception failures for third-party site errors
// This is necessary because DemoQA has JavaScript errors we can't control
Cypress.on("uncaught:exception", (err) => {
  // Log the error for debugging purposes
  console.warn("Uncaught exception:", err.message);

  // Return false to prevent the test from failing
  // Note: In a real application you control, you'd want to be more selective
  return false;
});

// ============================================================
// CUSTOM TEST LOGGING
// ============================================================

beforeEach(function () {
  const testTitle = this.currentTest?.title || "Unknown test";
  const specName = Cypress.spec.name;

  cy.log(`🧪 Starting: ${testTitle}`);

  Cypress.log({
    name: "TEST START",
    message: `${specName} > ${testTitle}`,
    consoleProps: () => ({
      spec: specName,
      test: testTitle,
      timestamp: new Date().toISOString(),
    }),
  });
});

afterEach(function () {
  const testTitle = this.currentTest?.title || "Unknown test";
  const state = this.currentTest?.state || "unknown";
  const duration = this.currentTest?.duration || 0;

  const emoji = state === "passed" ? "✅" : state === "failed" ? "❌" : "⏭️";

  cy.log(`${emoji} ${state.toUpperCase()}: ${testTitle} (${duration}ms)`);
});

// ============================================================
// VIEWPORT HANDLING
// ============================================================

// Apply viewport from environment if specified
before(() => {
  const viewportName = Cypress.expose("viewport");
  const viewports = Cypress.expose("viewports");

  if (viewportName && viewports && viewports[viewportName]) {
    const { width, height } = viewports[viewportName];
    cy.viewport(width, height);
    cy.log(`📱 Viewport set to: ${viewportName} (${width}x${height})`);
  }
});

// ============================================================
// PERFORMANCE MONITORING (Optional)
// ============================================================

// Track slow tests
afterEach(function () {
  const duration = this.currentTest?.duration || 0;
  const SLOW_TEST_THRESHOLD = 10000; // 10 seconds

  if (duration > SLOW_TEST_THRESHOLD) {
    console.warn(
      `⚠️ Slow test detected: "${this.currentTest?.title}" took ${duration}ms`
    );
  }
});
