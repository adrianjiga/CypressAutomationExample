import "cypress-wait-until";

// Form handling commands
Cypress.Commands.add("fillForm", (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`#${field}`).type(value);
  });
});

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
  },
);

// Table interaction commands
Cypress.Commands.add(
  "searchInTable",
  (searchText, tableSelector = ".rt-tbody") => {
    cy.get("#searchBox").clear();
    cy.get("#searchBox").type(searchText);
    cy.get("#searchBox").should("have.value", searchText);
    return cy.get(tableSelector);
  },
);

Cypress.Commands.add("verifyTableRow", (rowSelector, expectedData) => {
  cy.get(rowSelector).within(() => {
    Object.entries(expectedData).forEach(([columnIndex, value]) => {
      cy.get(".rt-td").eq(parseInt(columnIndex)).should("contain", value);
    });
  });
});

Cypress.Commands.add("tableAction", (rowIdentifier, action = "edit") => {
  const actionMap = {
    edit: "Edit",
    delete: "Delete",
  };

  cy.contains(".rt-tr-group", rowIdentifier)
    .find(`span[title="${actionMap[action]}"]`)
    .click();
});

// UI interaction commands
Cypress.Commands.add("waitAndClick", (selector, options = {}) => {
  const defaultOptions = { timeout: 10000 };
  const mergedOptions = { ...defaultOptions, ...options };

  return cy
    .get(selector, { timeout: mergedOptions.timeout })
    .should("be.visible")
    .click(mergedOptions);
});

Cypress.Commands.add("selectDate", (dateInput, month, year, day) => {
  cy.get(dateInput).click();
  cy.get(".react-datepicker__month-select").select(month);
  cy.get(".react-datepicker__year-select").select(year);
  cy.get(`.react-datepicker__day.react-datepicker__day--0${day}`)
    .first()
    .click();
});
