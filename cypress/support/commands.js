import "cypress-wait-until";

// ============================================================
// FORM HANDLING COMMANDS
// ============================================================

/**
 * Fill multiple form fields by their IDs
 * @example
 * cy.fillForm({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' })
 * @param {Object.<string, string>} formData - Key-value pairs where key is field ID (without #)
 */
Cypress.Commands.add("fillForm", (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`#${field}`).type(value);
  });
});

/**
 * Fill and submit a form, optionally verifying a success modal
 * @example
 * cy.submitFormAndVerify({ name: 'Test' }, 'submit', 'Success!')
 * @param {Object.<string, string>} formData - Form field data
 * @param {string} [submitButtonId='submit'] - ID of the submit button
 * @param {string} [modalTitle] - Expected modal title text (optional)
 */
Cypress.Commands.add(
  "submitFormAndVerify",
  (formData, submitButtonId = "submit", modalTitle) => {
    cy.fillForm(formData);
    cy.get(`#${submitButtonId}`).click({ force: true });
    if (modalTitle) {
      cy.get("#example-modal-sizes-title-lg")
        .should("be.visible")
        .and("contain", modalTitle);
    }
  }
);

// ============================================================
// TABLE INTERACTION COMMANDS
// ============================================================

/**
 * Search for text in a table using the search box
 * @example
 * cy.searchInTable('John').should('contain', 'John')
 * @param {string} searchText - Text to search for
 * @param {string} [tableSelector='.rt-tbody'] - Selector for the table body
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The table element
 */
Cypress.Commands.add(
  "searchInTable",
  (searchText, tableSelector = ".rt-tbody") => {
    cy.get("#searchBox").clear();
    cy.get("#searchBox").type(searchText);
    cy.get("#searchBox").should("have.value", searchText);
    return cy.get(tableSelector);
  }
);

/**
 * Verify data in a table row by column index
 * @example
 * cy.verifyTableRow('.rt-tr-group:first', { 0: 'John', 1: 'Doe', 2: '30' })
 * @param {string} rowSelector - Selector for the table row
 * @param {Object.<string, string>} expectedData - Column index to expected value mapping
 */
Cypress.Commands.add("verifyTableRow", (rowSelector, expectedData) => {
  cy.get(rowSelector).within(() => {
    Object.entries(expectedData).forEach(([columnIndex, value]) => {
      cy.get(".rt-td").eq(parseInt(columnIndex)).should("contain", value);
    });
  });
});

/**
 * Perform an action (edit/delete) on a table row
 * @example
 * cy.tableAction('John Doe', 'edit')
 * cy.tableAction('Jane Smith', 'delete')
 * @param {string} rowIdentifier - Text to identify the row
 * @param {'edit'|'delete'} [action='edit'] - Action to perform
 */
Cypress.Commands.add("tableAction", (rowIdentifier, action = "edit") => {
  const actionMap = {
    edit: "Edit",
    delete: "Delete",
  };

  cy.contains(".rt-tr-group", rowIdentifier)
    .find(`span[title="${actionMap[action]}"]`)
    .click();
});

/**
 * Get the count of visible (non-empty) rows in a table
 * @example
 * cy.getTableRowCount().should('eq', 5)
 * @param {string} [tableSelector='.rt-tbody'] - Table body selector
 * @returns {Cypress.Chainable<number>} Row count
 */
Cypress.Commands.add("getTableRowCount", (tableSelector = ".rt-tbody") => {
  return cy
    .get(`${tableSelector} div[role="row"]`)
    .not(".-padRow")
    .its("length");
});

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
 * Select a date from the react-datepicker component
 * @example
 * cy.selectDate('#dateInput', 'January', '1990', '15')
 * @param {string} dateInput - Selector for the date input
 * @param {string} month - Month name (e.g., 'January')
 * @param {string} year - Year (e.g., '1990')
 * @param {string} day - Day with leading zero (e.g., '01', '15')
 */
Cypress.Commands.add("selectDate", (dateInput, month, year, day) => {
  cy.get(dateInput).click();
  cy.get(".react-datepicker__month-select").select(month);
  cy.get(".react-datepicker__year-select").select(year);
  cy.get(`.react-datepicker__day.react-datepicker__day--0${day}`)
    .first()
    .click();
});

/**
 * Select an option from a react-select dropdown
 * @example
 * cy.selectReactOption('#state', 0) // Select first option
 * @param {string} dropdownSelector - Selector for the dropdown container
 * @param {number} optionIndex - Index of the option to select (0-based)
 */
Cypress.Commands.add("selectReactOption", (dropdownSelector, optionIndex) => {
  cy.get(dropdownSelector).click();
  cy.get(`[id^="react-select"][id$="-option-${optionIndex}"]`).click();
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
 * Validate response against a schema
 * @example
 * cy.validateSchema(response.body, { name: 'string', age: 'number' })
 * @param {Object} data - Data to validate
 * @param {Object.<string, string>} schema - Property name to type mapping
 */
Cypress.Commands.add("validateSchema", (data, schema) => {
  Object.entries(schema).forEach(([key, type]) => {
    expect(data).to.have.property(key);
    expect(typeof data[key]).to.eq(type);
  });
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

/**
 * Preserve cookies/localStorage between tests (useful for login state)
 * @example
 * cy.preserveSession()
 */
Cypress.Commands.add("preserveSession", () => {
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value);
    });
  });
});
