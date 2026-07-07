/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // ============================================================
    // UI INTERACTION COMMANDS
    // ============================================================

    /**
     * Wait for an element to be visible and then click it
     * @param selector - Element selector
     * @param options - Click options including timeout and force
     */
    waitAndClick(
      selector: string,
      options?: Partial<Cypress.ClickOptions> & { timeout?: number }
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Select a date from the react-datepicker component
     * @param dateInput - Selector for the date input
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

    // ============================================================
    // ASSERTION COMMANDS
    // ============================================================

    /**
     * Verify an element has a specific CSS property value
     * @param selector - Element selector
     * @param property - CSS property name
     * @param value - Expected CSS value
     */
    verifyCssProperty(
      selector: string,
      property: string,
      value: string
    ): Chainable<void>;

    /**
     * Verify an input field has validation error styling
     * @param selector - Input selector
     * @param errorColor - Expected error border color (default: 'rgb(220, 53, 69)')
     */
    verifyValidationError(selector: string, errorColor?: string): Chainable<void>;

    // ============================================================
    // API HELPER COMMANDS
    // ============================================================

    /**
     * Make an API request with default headers
     * @param method - HTTP method
     * @param url - Request URL (relative or absolute)
     * @param options - Additional request options
     */
    apiRequest(
      method: string,
      url: string,
      options?: Partial<Cypress.RequestOptions>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Chainable<Cypress.Response<any>>;

    /**
     * Validate data against a registered JSON Schema (draft-07) via Ajv.
     * @param data - Data to validate (object or array)
     * @param schema - Registered schema $id (e.g. "post"), or a raw schema object
     */
    validateSchema(
      data: unknown,
      schema: string | Record<string, unknown>
    ): Chainable<void>;

    // ============================================================
    // UTILITY COMMANDS
    // ============================================================

    /**
     * Log a message to both Cypress log and console
     * @param message - Message to log
     * @param data - Optional data to include
     */
    logMessage(message: string, data?: Record<string, unknown>): Chainable<void>;

    /**
     * Take a screenshot with a descriptive name
     * @param name - Screenshot name
     * @param options - Screenshot options
     */
    takeScreenshot(
      name: string,
      options?: Partial<Cypress.ScreenshotOptions>
    ): Chainable<void>;

    // ============================================================
    // THIRD-PARTY PLUGIN COMMANDS
    // ============================================================

    /**
     * Wait until a condition is met (from cypress-wait-until)
     * @param checkFunction - Function that returns truthy when condition is met
     * @param options - Wait options
     */
    waitUntil(
      checkFunction: () => Chainable<boolean> | boolean | PromiseLike<boolean>,
      options?: {
        timeout?: number;
        interval?: number;
        errorMsg?: string;
        description?: string;
        customMessage?: string;
        verbose?: boolean;
        log?: boolean;
      }
    ): Chainable<boolean>;

  }
}