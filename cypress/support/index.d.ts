/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // ============================================================
    // FORM HANDLING COMMANDS
    // ============================================================

    /**
     * Fill multiple form fields by their IDs
     * @param formData - Key-value pairs where key is field ID (without #)
     * @example cy.fillForm({ firstName: 'John', lastName: 'Doe' })
     */
    fillForm(formData: Record<string, string>): Chainable<void>;

    /**
     * Fill and submit a form, optionally verifying a success modal
     * @param formData - Form field data
     * @param submitButtonId - ID of the submit button (default: 'submit')
     * @param modalTitle - Expected modal title text (optional)
     */
    submitFormAndVerify(
      formData: Record<string, string>,
      submitButtonId?: string,
      modalTitle?: string
    ): Chainable<void>;

    // ============================================================
    // TABLE INTERACTION COMMANDS
    // ============================================================

    /**
     * Search for text in a table using the search box
     * @param searchText - Text to search for
     * @param tableSelector - Selector for the table body (default: '.rt-tbody')
     */
    searchInTable(
      searchText: string,
      tableSelector?: string
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Verify data in a table row by column index
     * @param rowSelector - Selector for the table row
     * @param expectedData - Column index to expected value mapping
     */
    verifyTableRow(
      rowSelector: string,
      expectedData: Record<string, string>
    ): Chainable<void>;

    /**
     * Perform an action (edit/delete) on a table row
     * @param rowIdentifier - Text to identify the row
     * @param action - Action to perform ('edit' or 'delete')
     */
    tableAction(rowIdentifier: string, action?: "edit" | "delete"): Chainable<void>;

    /**
     * Get the count of visible (non-empty) rows in a table
     * @param tableSelector - Table body selector (default: '.rt-tbody')
     */
    getTableRowCount(tableSelector?: string): Chainable<number>;

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

    /**
     * Select an option from a react-select dropdown
     * @param dropdownSelector - Selector for the dropdown container
     * @param optionIndex - Index of the option to select (0-based)
     */
    selectReactOption(
      dropdownSelector: string,
      optionIndex: number
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
    ): Chainable<Cypress.Response<unknown>>;

    /**
     * Validate response against a schema
     * @param data - Data to validate
     * @param schema - Property name to type mapping
     */
    validateSchema(
      data: Record<string, unknown>,
      schema: Record<string, string>
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

    /**
     * Preserve cookies/localStorage between tests
     */
    preserveSession(): Chainable<void>;

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