/**
 * Page Object for DemoQA Web Tables page
 * @see https://demoqa.com/webtables
 */
export const WebTablesPage = {
  url: "/webtables",

  selectors: {
    searchBox: "#searchBox",
    addNewRecordButton: "#addNewRecordButton",
    tableBody: ".rt-tbody",
    tableRow: '.rt-tbody div[role="row"]',
    tableRowActive: '.rt-tbody div[role="row"]:not(.-padRow)',
    tableCell: ".rt-td",
    tableGroup: ".rt-tr-group",
    modal: ".modal-content",
    modalTitle: "#registration-form-modal",
    firstName: "#firstName",
    lastName: "#lastName",
    email: "#userEmail",
    age: "#age",
    salary: "#salary",
    department: "#department",
    submitButton: "#submit",
    editRecord: (id) => `#edit-record-${id}`,
    deleteRecord: (id) => `#delete-record-${id}`,
    rowsPerPageSelect: 'select[aria-label="rows per page"]',
    totalPages: ".-totalPages",
    nextButton: ".-next",
    previousButton: ".-previous",
  },

  /**
   * Navigate to the Web Tables page
   */
  visit() {
    cy.intercept("GET", "/webtables").as("pageLoad");
    cy.visit(this.url);
    cy.wait("@pageLoad");
    return this;
  },

  /**
   * Search for a record in the table
   * @param {string} searchText - Text to search for
   */
  search(searchText) {
    cy.get(this.selectors.searchBox).clear();
    cy.get(this.selectors.searchBox).type(searchText);
    cy.get(this.selectors.searchBox).should("have.value", searchText);
    return this;
  },

  /**
   * Clear the search box
   */
  clearSearch() {
    cy.get(this.selectors.searchBox).clear();
    cy.get(this.selectors.searchBox).should("have.value", "");
    return this;
  },

  /**
   * Get all visible (non-empty) rows
   */
  getVisibleRows() {
    return cy.get(this.selectors.tableRowActive);
  },

  /**
   * Verify the number of visible rows
   * @param {number} count - Expected number of rows
   */
  verifyRowCount(count) {
    this.getVisibleRows().should("have.length", count);
    return this;
  },

  /**
   * Verify row count is at least a certain number
   * @param {number} minCount - Minimum expected rows
   */
  verifyMinRowCount(minCount) {
    this.getVisibleRows().should("not.have.length.below", minCount);
    return this;
  },

  /**
   * Click the Add New Record button and wait for modal
   */
  openAddModal() {
    cy.waitAndClick(this.selectors.addNewRecordButton);
    cy.get(this.selectors.modal).should("be.visible");
    cy.get(this.selectors.modalTitle).should("contain", "Registration Form");
    return this;
  },

  /**
   * Click the edit button for a specific record
   * @param {number} recordId - Record ID to edit
   */
  openEditModal(recordId) {
    cy.get(this.selectors.editRecord(recordId)).should("be.visible").click();
    cy.get(this.selectors.modal).should("be.visible");
    return this;
  },

  /**
   * Delete a specific record
   * @param {number} recordId - Record ID to delete
   */
  deleteRecord(recordId) {
    cy.get(this.selectors.deleteRecord(recordId)).click();
    return this;
  },

  /**
   * Fill the registration/edit form
   * @param {Object} data - Form data object
   */
  fillForm(data) {
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
   * Submit the form and wait for modal to close
   */
  submitForm() {
    cy.waitAndClick(this.selectors.submitButton);
    cy.get(this.selectors.modal).should("not.exist");
    return this;
  },

  /**
   * Verify a record exists with specific data
   * @param {Object} data - Expected data in the row
   */
  verifyRecordExists(data) {
    cy.get(this.selectors.tableBody).within(() => {
      cy.contains(this.selectors.tableGroup, data.firstName).within(() => {
        if (data.firstName) {
          cy.get(this.selectors.tableCell).eq(0).should("contain", data.firstName);
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
          cy.get(this.selectors.tableCell).eq(5).should("contain", data.department);
        }
      });
    });
    return this;
  },

  /**
   * Verify record has edit and delete buttons
   * @param {string} identifier - Text to identify the row
   */
  verifyRecordActions(identifier) {
    cy.contains(this.selectors.tableGroup, identifier).within(() => {
      cy.get(this.selectors.tableCell).eq(6).find('span[title="Edit"]').should("exist");
      cy.get(this.selectors.tableCell).eq(6).find('span[title="Delete"]').should("exist");
    });
    return this;
  },

  /**
   * Change the number of rows displayed per page
   * @param {number} rowsPerPage - Number of rows (5, 10, 20, 25, 50, 100)
   */
  setRowsPerPage(rowsPerPage) {
    cy.get(this.selectors.rowsPerPageSelect).select(`${rowsPerPage} rows`);
    return this;
  },

  /**
   * Verify the total number of pages
   * @param {string} expectedPages - Expected page count as string
   */
  verifyTotalPages(expectedPages) {
    cy.get(this.selectors.totalPages).should("contain", expectedPages);
    return this;
  },

  /**
   * Navigate to next page
   */
  goToNextPage() {
    cy.get(this.selectors.nextButton).click();
    return this;
  },

  /**
   * Navigate to previous page
   */
  goToPreviousPage() {
    cy.get(this.selectors.previousButton).click();
    return this;
  },

  /**
   * Verify next button is enabled
   */
  verifyNextEnabled() {
    cy.get(this.selectors.nextButton).should("not.be.disabled");
    return this;
  },

  /**
   * Verify previous button is enabled
   */
  verifyPreviousEnabled() {
    cy.get(this.selectors.previousButton).should("not.be.disabled");
    return this;
  },

  /**
   * Get data from the first row
   * @returns {Cypress.Chainable<Object>}
   */
  getFirstRowData() {
    return this.getVisibleRows()
      .first()
      .then(($row) => {
        return {
          firstName: $row.find("div").eq(0).text(),
          lastName: $row.find("div").eq(1).text(),
          age: $row.find("div").eq(2).text(),
          email: $row.find("div").eq(3).text(),
          salary: $row.find("div").eq(4).text(),
          department: $row.find("div").eq(5).text(),
        };
      });
  },

  /**
   * Get data from a specific row by index
   * @param {number} index - Row index (0-based)
   * @returns {Cypress.Chainable<Object>}
   */
  getRowData(index) {
    return this.getVisibleRows()
      .eq(index)
      .then(($row) => {
        return {
          firstName: $row.find("div").eq(0).text(),
          lastName: $row.find("div").eq(1).text(),
          age: $row.find("div").eq(2).text(),
          email: $row.find("div").eq(3).text(),
          salary: $row.find("div").eq(4).text(),
          department: $row.find("div").eq(5).text(),
        };
      });
  },
};