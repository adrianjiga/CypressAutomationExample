describe('Demo Website', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/');
  });

  it('should load the registration form', () => {
    cy.get('#register-form').should('be.visible');
  });

  it('should register a new user', () => {
    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.get('#username').type('johndoe');
    cy.get('#email').type('john@example.com');
    cy.get('#date').type('1990-01-01');
    cy.get('#color-picker').invoke('val', '#ff0000').trigger('change');
    cy.get('input[name="gender"][value="male"]').check();
    cy.get('#terms').check();
    cy.get('#register-form').submit();

    // Check if the user appears in the table
    cy.get('#user-table').contains('td', 'John');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('#register-form').submit();
    cy.get('#first-name-error').should('be.visible');
    cy.get('#last-name-error').should('be.visible');
    cy.get('#username-error').should('be.visible');
    cy.get('#email-error').should('be.visible');
  });

  it('should paginate the user table', () => {
    for (let index = 0; index < 12; index++) {
      cy.get('#first-name').type('John' + index);
      cy.get('#last-name').type('Doe' + index);
      cy.get('#username').type('johndoe' + index);
      cy.get('#email').type('john' + index + '@example.com');
      cy.get('#date').type('1990-01-01');
      cy.get('#color-picker').invoke('val', '#ff0000').trigger('change');
      cy.get('input[name="gender"][value="male"]').check();
      cy.get('#terms').check();
      cy.get('#register-form').submit();
    }

    cy.get('#items-per-page').select('10');
    cy.get('#user-table tbody tr').should('have.length', 10);
    cy.get('#next-page').click();
    cy.get('#user-table tbody tr').should('have.length.gt', 0);
  });

  it('should switch between tabs', () => {
    cy.get('#tab1').click();
    cy.get('#panel1').should('be.visible');
    cy.get('#panel2').should('not.be.visible');

    cy.get('#tab2').click();
    cy.get('#panel2').should('be.visible');
    cy.get('#panel1').should('not.be.visible');
  });
});
