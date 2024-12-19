describe("Buttons", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (_err, _runnable) => {
      return false;
    });

    cy.visit("/buttons");
  });
  it("should interact with double click button", { tags: "@ui" }, () => {
    cy.get("#doubleClickBtn").dblclick();
    cy.get("#doubleClickMessage").should(
      "contain",
      "You have done a double click"
    );
  });

  it("should interact with right click button", { tags: "@ui" }, () => {
    cy.get("#rightClickBtn").rightclick();
    cy.get("#rightClickMessage").should(
      "contain",
      "You have done a right click"
    );
  });

  it("should interact with dynamic button", { tags: "@ui" }, () => {
    cy.get("div.mt-4:nth-child(4) button").click({ force: true });
    cy.get("#dynamicClickMessage").should(
      "contain",
      "You have done a dynamic click"
    );
  });
});
