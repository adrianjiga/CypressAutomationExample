import type { RowData, UserData } from "../types/models";

/**
 * Page Object for the Web Tables helper page.
 * @see https://adrianjiga.github.io/qa/helpers/webtables
 */
export const WebTablesPage = {
  url: "/qa/helpers/webtables",

  selectors: {
    searchBox: '[data-cy="searchBox"]',
    addNewRecordButton: '[data-cy="addRecordBtn"]',
    tableBody: '[data-cy="tableBody"]',
    rows: '[data-cy="tableBody"] tr',
    tableCell: "td",
    modal: '[data-cy="registrationModal"]',
    modalTitle: '[data-cy="modalTitle"]',
    firstName: '[data-cy="modalFirstName"]',
    lastName: '[data-cy="modalLastName"]',
    email: '[data-cy="modalEmail"]',
    age: '[data-cy="modalAge"]',
    salary: '[data-cy="modalSalary"]',
    department: '[data-cy="modalDepartment"]',
    submitButton: '[data-cy="modalSubmitBtn"]',
    editRecord: (id: number) => `[data-cy="editBtn${id}"]`,
    deleteRecord: (id: number) => `[data-cy="deleteBtn${id}"]`,
    rowsPerPageSelect: '[data-cy="rowsPerPageSelect"]',
    totalPages: '[data-cy="totalPages"]',
    nextButton: '[data-cy="nextPageBtn"]',
    previousButton: '[data-cy="prevPageBtn"]',
  },

  /**
   * Navigate to the Web Tables page.
   */
  visit() {
    cy.intercept("GET", "/qa/helpers/webtables").as("pageLoad");
    cy.visit(this.url);
    cy.wait("@pageLoad");
    return this;
  },

  /**
   * Search for a record in the table.
   */
  search(searchText: string) {
    cy.get(this.selectors.searchBox).clear();
    cy.get(this.selectors.searchBox).type(searchText);
    cy.get(this.selectors.searchBox).should("have.value", searchText);
    return this;
  },

  /**
   * Clear the search box.
   */
  clearSearch() {
    cy.get(this.selectors.searchBox).clear();
    cy.get(this.selectors.searchBox).should("have.value", "");
    return this;
  },

  /**
   * Get all visible (non-empty) rows.
   */
  getVisibleRows(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.rows);
  },

  /**
   * Verify the number of visible rows.
   */
  verifyRowCount(count: number) {
    this.getVisibleRows().should("have.length", count);
    return this;
  },

  /**
   * Verify the row count is at least a certain number.
   */
  verifyMinRowCount(minCount: number) {
    this.getVisibleRows().should("not.have.length.below", minCount);
    return this;
  },

  /**
   * Click the Add New Record button and wait for the modal.
   */
  openAddModal() {
    cy.waitAndClick(this.selectors.addNewRecordButton);
    cy.get(this.selectors.modal).should("be.visible");
    cy.get(this.selectors.modalTitle).should("contain", "Registration Form");
    return this;
  },

  /**
   * Click the edit button for a specific record.
   */
  openEditModal(recordId: number) {
    cy.get(this.selectors.editRecord(recordId)).should("be.visible").click();
    cy.get(this.selectors.modal).should("be.visible");
    return this;
  },

  /**
   * Delete a specific record.
   */
  deleteRecord(recordId: number) {
    cy.get(this.selectors.deleteRecord(recordId)).click();
    return this;
  },

  /**
   * Fill the registration/edit form.
   */
  fillForm(data: Partial<UserData>) {
    if (data.firstName) {
      cy.get(this.selectors.firstName).clear();
      cy.get(this.selectors.firstName).type(data.firstName);
    }
    if (data.lastName) {
      cy.get(this.selectors.lastName).clear();
      cy.get(this.selectors.lastName).type(data.lastName);
    }
    if (data.email) {
      cy.get(this.selectors.email).clear();
      cy.get(this.selectors.email).type(data.email);
    }
    if (data.age) {
      cy.get(this.selectors.age).clear();
      cy.get(this.selectors.age).type(data.age);
    }
    if (data.salary) {
      cy.get(this.selectors.salary).clear();
      cy.get(this.selectors.salary).type(data.salary);
    }
    if (data.department) {
      cy.get(this.selectors.department).clear();
      cy.get(this.selectors.department).type(data.department);
    }
    return this;
  },

  /**
   * Submit the form and wait for the modal to close.
   */
  submitForm() {
    cy.waitAndClick(this.selectors.submitButton);
    cy.get(this.selectors.modal).should("not.exist");
    return this;
  },

  /**
   * Verify a record exists with specific data.
   */
  verifyRecordExists(data: Partial<UserData>) {
    cy.contains(this.selectors.rows, data.firstName).within(() => {
      if (data.firstName) {
        cy.get(this.selectors.tableCell)
          .eq(0)
          .should("contain", data.firstName);
      }
      if (data.lastName) {
        cy.get(this.selectors.tableCell).eq(1).should("contain", data.lastName);
      }
      if (data.age) {
        cy.get(this.selectors.tableCell).eq(2).should("contain", data.age);
      }
      if (data.email) {
        cy.get(this.selectors.tableCell).eq(3).should("contain", data.email);
      }
      if (data.salary) {
        cy.get(this.selectors.tableCell).eq(4).should("contain", data.salary);
      }
      if (data.department) {
        cy.get(this.selectors.tableCell)
          .eq(5)
          .should("contain", data.department);
      }
    });
    return this;
  },

  /**
   * Verify a record has edit and delete buttons.
   */
  verifyRecordActions(identifier: string) {
    cy.contains(this.selectors.rows, identifier).within(() => {
      cy.get(this.selectors.tableCell)
        .eq(6)
        .find('[data-cy^="editBtn"]')
        .should("exist");
      cy.get(this.selectors.tableCell)
        .eq(6)
        .find('[data-cy^="deleteBtn"]')
        .should("exist");
    });
    return this;
  },

  /**
   * Change the number of rows displayed per page.
   */
  setRowsPerPage(rowsPerPage: number) {
    cy.get(this.selectors.rowsPerPageSelect).select(`${rowsPerPage} rows`);
    return this;
  },

  /**
   * Verify the total number of pages.
   */
  verifyTotalPages(expectedPages: string) {
    cy.get(this.selectors.totalPages).should("contain", expectedPages);
    return this;
  },

  /**
   * Navigate to the next page.
   */
  goToNextPage() {
    cy.get(this.selectors.nextButton).click();
    return this;
  },

  /**
   * Navigate to the previous page.
   */
  goToPreviousPage() {
    cy.get(this.selectors.previousButton).click();
    return this;
  },

  /**
   * Verify the next button is enabled.
   */
  verifyNextEnabled() {
    cy.get(this.selectors.nextButton).should("not.be.disabled");
    return this;
  },

  /**
   * Verify the previous button is enabled.
   */
  verifyPreviousEnabled() {
    cy.get(this.selectors.previousButton).should("not.be.disabled");
    return this;
  },

  /**
   * Get data from the first row.
   */
  getFirstRowData(): Cypress.Chainable<RowData> {
    return this.getVisibleRows()
      .first()
      .then(($row) => {
        return {
          firstName: $row.find("td").eq(0).text(),
          lastName: $row.find("td").eq(1).text(),
          age: $row.find("td").eq(2).text(),
          email: $row.find("td").eq(3).text(),
          salary: $row.find("td").eq(4).text(),
          department: $row.find("td").eq(5).text(),
        };
      });
  },

  /**
   * Get data from a specific row by index.
   * @param index - Row index (0-based)
   */
  getRowData(index: number): Cypress.Chainable<RowData> {
    return this.getVisibleRows()
      .eq(index)
      .then(($row) => {
        return {
          firstName: $row.find("td").eq(0).text(),
          lastName: $row.find("td").eq(1).text(),
          age: $row.find("td").eq(2).text(),
          email: $row.find("td").eq(3).text(),
          salary: $row.find("td").eq(4).text(),
          department: $row.find("td").eq(5).text(),
        };
      });
  },
};
