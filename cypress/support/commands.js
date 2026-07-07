import "cypress-wait-until";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import postSchema from "../fixtures/schemas/post-schema.json";
import postsArraySchema from "../fixtures/schemas/posts-array-schema.json";
import commentSchema from "../fixtures/schemas/comment-schema.json";
import commentsArraySchema from "../fixtures/schemas/comments-array-schema.json";

// Single Ajv instance with every schema registered by $id, so array schemas can
// $ref their item schema (e.g. "posts-array" → "post") and specs can validate by id.
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajv.addSchema([
  postSchema,
  postsArraySchema,
  commentSchema,
  commentsArraySchema,
]);

// ============================================================
// UI INTERACTION COMMANDS
// ============================================================

/**
 * Wait for an element to be visible and then click it
 * Useful for elements that may take time to appear or need force clicking
 * @example
 * cy.waitAndClick('#submit')
 * cy.waitAndClick('.modal-button', { force: true, timeout: 15000 })
 * @param {string} selector - Element selector
 * @param {Object} [options={}] - Click options
 * @param {number} [options.timeout=10000] - Visibility timeout in ms
 * @param {boolean} [options.force=false] - Force click
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The clicked element
 */
Cypress.Commands.add("waitAndClick", (selector, options = {}) => {
  const defaultOptions = { timeout: 10000 };
  const mergedOptions = { ...defaultOptions, ...options };

  return cy
    .get(selector, { timeout: mergedOptions.timeout })
    .should("be.visible")
    .click(mergedOptions);
});

/**
 * Select a date from the custom datepicker component
 * @example
 * cy.selectDate('#dateInput', 'January', '1990', '15')
 * @param {string} dateInput - Selector for the date input
 * @param {string} month - Month name (e.g., 'January')
 * @param {string} year - Year (e.g., '1990')
 * @param {string} day - Day with leading zero (e.g., '01', '15')
 */
Cypress.Commands.add("selectDate", (dateInput, month, year, day) => {
  cy.get(dateInput).click();
  cy.get("[data-cy='month-select']").select(month);
  cy.get("[data-cy='year-select']").select(year);
  cy.get(`[data-cy="day-${day}"]`).first().click();
});

// ============================================================
// ASSERTION COMMANDS
// ============================================================

/**
 * Verify an element has a specific CSS property value
 * @example
 * cy.verifyCssProperty('#input', 'border-color', 'rgb(220, 53, 69)')
 * @param {string} selector - Element selector
 * @param {string} property - CSS property name
 * @param {string} value - Expected CSS value
 */
Cypress.Commands.add("verifyCssProperty", (selector, property, value) => {
  cy.get(selector).should("have.css", property, value);
});

/**
 * Verify an input field has validation error styling
 * @example
 * cy.verifyValidationError('#email')
 * @param {string} selector - Input selector
 * @param {string} [errorColor='rgb(220, 53, 69)'] - Expected error border color
 */
Cypress.Commands.add(
  "verifyValidationError",
  (selector, errorColor = "rgb(220, 53, 69)") => {
    cy.get(selector).should("have.css", "border-color", errorColor);
  }
);

// ============================================================
// API HELPER COMMANDS
// ============================================================

/**
 * Make an API request with default headers
 * @example
 * cy.apiRequest('GET', '/BookStore/v1/Books').then(response => { ... })
 * @param {string} method - HTTP method
 * @param {string} url - Request URL (relative or absolute)
 * @param {Object} [options={}] - Additional request options
 * @returns {Cypress.Chainable<Cypress.Response>} Response object
 */
Cypress.Commands.add("apiRequest", (method, url, options = {}) => {
  const defaultHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
  };

  return cy.request({
    method,
    url,
    headers: { ...defaultHeaders, ...options.headers },
    failOnStatusCode: false,
    ...options,
  });
});

/**
 * Validate data against a registered JSON Schema (draft-07) using Ajv.
 * Accepts a schema $id string (preferred, e.g. "post") or a raw schema object.
 * Reports every violation at once (paths + messages), not just the first.
 * @example
 * cy.validateSchema(response.body, "posts-array")
 * cy.validateSchema(response.body, "post")
 * @param {unknown} data - Data to validate
 * @param {string|object} schema - Registered schema $id, or a schema object
 */
Cypress.Commands.add("validateSchema", (data, schema) => {
  const validate =
    typeof schema === "string" ? ajv.getSchema(schema) : ajv.compile(schema);
  if (!validate) {
    throw new Error(`No JSON schema registered with id "${schema}".`);
  }
  const valid = validate(data);
  const errors = (validate.errors || [])
    .map((e) => `${e.instancePath || "(root)"} ${e.message}`)
    .join("; ");
  expect(valid, errors || "response matches JSON schema").to.eq(true);
});

// ============================================================
// UTILITY COMMANDS
// ============================================================

/**
 * Log a message to both Cypress log and console
 * @example
 * cy.logMessage('Test step completed', { userId: 123 })
 * @param {string} message - Message to log
 * @param {Object} [data] - Optional data to include
 */
Cypress.Commands.add("logMessage", (message, data) => {
  const logEntry = data ? `${message}: ${JSON.stringify(data)}` : message;
  cy.log(logEntry);
  Cypress.log({
    name: "INFO",
    message: logEntry,
    consoleProps: () => ({ message, data }),
  });
});

/**
 * Take a screenshot with a descriptive name
 * @example
 * cy.takeScreenshot('form-validation-errors')
 * @param {string} name - Screenshot name
 * @param {Object} [options={}] - Screenshot options
 */
Cypress.Commands.add("takeScreenshot", (name, options = {}) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  // eslint-disable-next-line cypress/assertion-before-screenshot
  cy.screenshot(`${name}_${timestamp}`, options);
});
