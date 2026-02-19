describe("Test Cypress Docs with waitUntil", () => {
  it(
    "Waits for the search button to be visible and clicks it",
    { tags: ["@ui"] },
    () => {
      cy.visit("https://docs.cypress.io");

      cy.get('button:contains("Search")', { timeout: 10000 });
      cy.get("body").then(($body) => {
        if ($body.find(".osano-cm-accept-all").length) {
          cy.get(".osano-cm-accept-all").click();
        }
      });

      cy.waitUntil(
        () =>
          cy
            .get('button:contains("Search ⌘K")', { timeout: 10000 })
            .should("be.visible"),
        {
          timeout: 15000,
          interval: 500,
          log: true,
        }
      );

      cy.get('button:contains("Search ⌘K")', { timeout: 10000 }).click();
      cy.get("#docsearch-input", { timeout: 10000 }).should("be.visible");
    }
  );
});
