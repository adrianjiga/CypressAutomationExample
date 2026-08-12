/**
 * Page Object for the Buttons helper page
 * @see https://adrianjiga.github.io/qa/helpers/buttons
 */
export const ButtonsPage = {
  url: "/qa/helpers/buttons",

  selectors: {
    doubleClickButton: '[data-cy="doubleClickBtn"]',
    rightClickButton: '[data-cy="rightClickBtn"]',
    dynamicClickButton: '[data-cy="dynamicClickBtn"]',
    doubleClickMessage: '[data-cy="doubleClickMessage"]',
    rightClickMessage: '[data-cy="rightClickMessage"]',
    dynamicClickMessage: '[data-cy="dynamicClickMessage"]',
  },

  messages: {
    doubleClick: "You have done a double click",
    rightClick: "You have done a right click",
    dynamicClick: "You have done a dynamic click",
  },

  /**
   * Navigate to the Buttons page
   */
  visit() {
    cy.visit(this.url);
    return this;
  },

  /**
   * Perform double click on the double click button
   */
  performDoubleClick() {
    cy.get(this.selectors.doubleClickButton).dblclick();
    return this;
  },

  /**
   * Perform right click on the right click button
   */
  performRightClick() {
    cy.get(this.selectors.rightClickButton).rightclick();
    return this;
  },

  /**
   * Perform dynamic click on the dynamic button
   * @param {Object} options - Click options
   */
  performDynamicClick(options = { force: true }) {
    cy.waitAndClick(this.selectors.dynamicClickButton, options);
    return this;
  },

  /**
   * Verify double click message is displayed
   */
  verifyDoubleClickMessage() {
    cy.get(this.selectors.doubleClickMessage).should(
      "contain",
      this.messages.doubleClick
    );
    return this;
  },

  /**
   * Verify right click message is displayed
   */
  verifyRightClickMessage() {
    cy.get(this.selectors.rightClickMessage).should(
      "contain",
      this.messages.rightClick
    );
    return this;
  },

  /**
   * Verify dynamic click message is displayed
   */
  verifyDynamicClickMessage() {
    cy.get(this.selectors.dynamicClickMessage).should(
      "contain",
      this.messages.dynamicClick
    );
    return this;
  },
};
