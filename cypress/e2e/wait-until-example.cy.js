describe('Test Cypress Docs with waitUntil', () => {
  it('Waits for the search button to be visible and clicks it', () => {
    cy.visit('https://docs.cypress.io');

    cy.waitUntil(
      () =>
        cy
          .get('button:contains("Search ⌘K")', { timeout: 10000 })
          .should('be.visible'),
      {
        timeout: 15000,
        interval: 500,
        log: true,
      }
    );

    cy.get('button:contains("Search ⌘K")', { timeout: 10000 }).click();
    cy.get('#docsearch-input', { timeout: 10000 }).should('be.visible');
  });
});
