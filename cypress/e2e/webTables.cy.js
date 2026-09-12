import { WebTablesPage } from "../pages";
import { userFactory } from "../support/factories";

describe("WebTables", () => {
  beforeEach(() => {
    WebTablesPage.visit();
  });

  it("search for a record", { tags: ["@webTables"] }, () => {
    WebTablesPage.search("Cierra");

    cy.contains(WebTablesPage.selectors.rows, "Cierra").should("be.visible");
    WebTablesPage.verifyRowCount(1);

    WebTablesPage.clearSearch();
    WebTablesPage.verifyMinRowCount(2);
  });

  it("edit an existing record", { tags: ["@webTables"] }, () => {
    const newAge = userFactory.generateAge();
    const newDepartment = "Engineering";

    WebTablesPage.openEditModal(1)
      .fillForm({ age: newAge.toString(), department: newDepartment })
      .submitForm();

    cy.contains(WebTablesPage.selectors.rows, "Cierra").within(() => {
      cy.get(WebTablesPage.selectors.tableCell).eq(2).should("contain", newAge);
      cy.get(WebTablesPage.selectors.tableCell)
        .eq(5)
        .should("contain", newDepartment);
    });
  });

  it("add a new record", { tags: ["@webTables", "@smoke"] }, () => {
    const newUser = userFactory.generate({ department: "Engineering" });

    WebTablesPage.openAddModal()
      .fillForm(newUser)
      .submitForm()
      .verifyRecordExists(newUser)
      .verifyRecordActions(newUser.firstName);
  });

  it("delete an existing record", { tags: ["@webTables"] }, () => {
    WebTablesPage.getVisibleRows().then(($rows) => {
      const initialRowCount = $rows.length;

      WebTablesPage.getRowData(1).then((secondRecordData) => {
        WebTablesPage.deleteRecord(1);
        WebTablesPage.getVisibleRows().should(
          "have.length",
          initialRowCount - 1
        );
        WebTablesPage.getFirstRowData().then((firstRowData) => {
          expect(firstRowData.firstName).to.equal(secondRecordData.firstName);
          expect(firstRowData.lastName).to.equal(secondRecordData.lastName);
          expect(firstRowData.age).to.equal(secondRecordData.age);
          expect(firstRowData.email).to.equal(secondRecordData.email);
          expect(firstRowData.salary).to.equal(secondRecordData.salary);
          expect(firstRowData.department).to.equal(secondRecordData.department);
        });
      });
    });
  });

  it("change the number of rows displayed", { tags: ["@webTables"] }, () => {
    const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];

    rowsPerPageOptions.forEach((rowsPerPage) => {
      WebTablesPage.setRowsPerPage(rowsPerPage);
      cy.get(WebTablesPage.selectors.rows).should(
        "have.length.at.most",
        rowsPerPage
      );
      WebTablesPage.verifyTotalPages("1");
    });
  });

  it("pagination when more than 5 records exist", {
    tags: ["@webTables"],
  }, () => {
    for (let i = 0; i < 3; i++) {
      const user = userFactory.generate({
        firstName: `User${i}`,
        lastName: "Test",
      });
      WebTablesPage.openAddModal().fillForm(user).submitForm();
    }

    WebTablesPage.setRowsPerPage(5).verifyTotalPages("2");

    WebTablesPage.goToNextPage();
    cy.get(WebTablesPage.selectors.rows).should("have.length.at.least", 1);
    cy.contains(WebTablesPage.selectors.rows, "User2").should("be.visible");

    WebTablesPage.verifyPreviousEnabled();
    WebTablesPage.goToPreviousPage();

    cy.contains(WebTablesPage.selectors.rows, "Cierra").should("be.visible");
    WebTablesPage.verifyNextEnabled();
  });
});
