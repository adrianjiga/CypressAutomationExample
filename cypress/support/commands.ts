import "cypress-wait-until";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { CategoryResult } from "webqualityanalyzer";
import commentSchema from "../fixtures/schemas/commentSchema.json";
import commentsArraySchema from "../fixtures/schemas/commentsArraySchema.json";
import postSchema from "../fixtures/schemas/postSchema.json";
import postsArraySchema from "../fixtures/schemas/postsArraySchema.json";

// Single Ajv instance with every schema registered by $id, so array schemas can
// $ref their item schema (e.g. "postsArray" → "post") and specs can validate by id.
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajv.addSchema([
  postSchema,
  postsArraySchema,
  commentSchema,
  commentsArraySchema,
]);

/**
 * Type declarations for the custom commands in this file. They live next to the
 * implementations so a command's interface travels with its code.
 *
 * `waitUntil` is intentionally absent: cypress-wait-until ships its own typings
 * for it, and declaring it again here would leave two signatures to keep in sync.
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for an element to be visible and then click it.
       * Useful for elements that may take time to appear or need force clicking.
       */
      waitAndClick(
        selector: string,
        options?: Partial<Cypress.ClickOptions> & { timeout?: number }
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Select a date from the custom datepicker component.
       * @param month - Month name (e.g., 'January')
       * @param year - Year (e.g., '1990')
       * @param day - Day with leading zero (e.g., '01', '15')
       */
      selectDate(
        dateInput: string,
        month: string,
        year: string,
        day: string
      ): Chainable<void>;

      /**
       * Verify an element has a specific CSS property value.
       */
      verifyCssProperty(
        selector: string,
        property: string,
        value: string
      ): Chainable<void>;

      /**
       * Verify an input field has validation error styling.
       */
      verifyValidationError(
        selector: string,
        errorColor?: string
      ): Chainable<void>;

      /**
       * Inject the WebQualityAnalyzer bundle into the page under test and yield
       * its accessibility findings. SEO and performance analysis are disabled.
       */
      auditAccessibility(): Chainable<CategoryResult>;

      /**
       * Make an API request with default headers. The response body is typed
       * via the generic when the shape is known, e.g. `apiRequest<Post[]>("GET", ...)`.
       */
      apiRequest<T = unknown>(
        method: string,
        url: string,
        options?: Partial<Cypress.RequestOptions>
      ): Chainable<Cypress.Response<T>>;

      /**
       * Validate data against a registered JSON Schema (draft-07) via Ajv.
       * @param schema - Registered schema $id (e.g. "post"), or a raw schema object
       */
      validateSchema(
        data: unknown,
        schema: string | Record<string, unknown>
      ): Chainable<void>;
    }
  }
}

// ============================================================
// UI INTERACTION COMMANDS
// ============================================================

/**
 * Wait for an element to be visible and then click it.
 * Useful for elements that may take time to appear or need force clicking.
 * @example
 * cy.waitAndClick('[data-cy="submitBtn"]')
 * cy.waitAndClick('.modal-button', { force: true, timeout: 15000 })
 */
Cypress.Commands.add(
  "waitAndClick",
  (
    selector,
    options: Partial<Cypress.ClickOptions> & { timeout?: number } = {}
  ) => {
    const defaultOptions = { timeout: 10000 };
    const mergedOptions = { ...defaultOptions, ...options };

    return cy
      .get(selector, { timeout: mergedOptions.timeout })
      .should("be.visible")
      .click(mergedOptions);
  }
);

/**
 * Select a date from the custom datepicker component.
 * @example
 * cy.selectDate('[data-cy="dateOfBirthInput"]', 'January', '1990', '15')
 */
Cypress.Commands.add("selectDate", (dateInput, month, year, day) => {
  cy.get(dateInput).click();
  cy.get("[data-cy='monthSelect']").select(month);
  cy.get("[data-cy='yearSelect']").select(year);
  cy.get(`[data-cy="day${day}"]`).first().click();
});

// ============================================================
// ASSERTION COMMANDS
// ============================================================

/**
 * Verify an element has a specific CSS property value.
 * @example
 * cy.verifyCssProperty('[data-cy="firstNameInput"]', 'border-color', 'rgb(220, 53, 69)')
 */
Cypress.Commands.add("verifyCssProperty", (selector, property, value) => {
  cy.get(selector).should("have.css", property, value);
});

/**
 * Verify an input field has validation error styling.
 * @example
 * cy.verifyValidationError('[data-cy="emailInput"]')
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
 * Make an API request with default headers.
 * @example
 * cy.apiRequest('GET', '/BookStore/v1/Books').then(response => { ... })
 */
Cypress.Commands.add(
  "apiRequest",
  (method, url, options: Partial<Cypress.RequestOptions> = {}) => {
    const defaultHeaders: Record<string, string> = {
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
  }
);

/**
 * Validate data against a registered JSON Schema (draft-07) using Ajv.
 * Accepts a schema $id string (preferred, e.g. "post") or a raw schema object.
 * Reports every violation at once (paths + messages), not just the first.
 * @example
 * cy.validateSchema(response.body, "postsArray")
 * cy.validateSchema(response.body, "post")
 */
Cypress.Commands.add(
  "validateSchema",
  (data, schema: string | Record<string, unknown>) => {
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
  }
);
