// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

import "cypress-plugin-api";

/**
 * https://www.npmjs.com/package/@cypress/grep
 *
 * Imports and registers the Cypress Grep plugin for use in Cypress test runs.
 *
 * The `registerCypressGrep` function is imported from the Cypress Grep library,
 * allowing tests to be filtered and executed based on specified grep patterns.
 * This is useful for selectively running tests during development or CI processes.
 *
 * Usage:
 * - To filter tests, use the `--env grep="pattern"` flag in your Cypress CLI command.
 *   Example: `npx cypress run --env grep="login tests"`
 */

import { register } from "@cypress/grep";
register();
