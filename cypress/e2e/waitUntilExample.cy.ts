import { WebTablesPage } from "../pages";

describe("WebTables with waitUntil", () => {
  it("waits for the registration modal to become visible after opening it", {
    tags: ["@ui"],
  }, () => {
    WebTablesPage.visit();

    cy.waitAndClick(WebTablesPage.selectors.addNewRecordButton);

    cy.waitUntil(
      () => cy.get(WebTablesPage.selectors.modal).should("be.visible"),
      {
        timeout: 15000,
        interval: 500,
        log: true,
      }
    );

    cy.get(WebTablesPage.selectors.modalTitle).should(
      "contain",
      "Registration Form"
    );
  });
});
