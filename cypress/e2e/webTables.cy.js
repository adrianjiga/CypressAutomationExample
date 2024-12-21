describe("WebTables", () => {
  beforeEach(() => {
    cy.intercept("GET", "/webtables").as("pageLoad");

    cy.on("uncaught:exception", (_err, _runnable) => {
      return false;
    });

    cy.visit("/webtables");
    cy.wait("@pageLoad");
  });

  it("search for a record", { tags: ["@webTables"] }, () => {
    cy.get("#searchBox").type("Cierra");
    cy.get("#searchBox").should("have.value", "Cierra");
    cy.contains('.rt-tbody div[role="row"]', "Cierra").should("be.visible");
    cy.get('.rt-tbody div[role="row"]')
      .not(".-padRow")
      .should("have.length", 1);
    cy.get("#searchBox").clear();
    cy.get("#searchBox").should("have.value", "");
    cy.get('.rt-tbody div[role="row"]')
      .not(".-padRow")
      .should("not.have.length.below", 2);
  });

  it("edit an existing record", { tags: ["@webTables"] }, () => {
    const newAge = Math.floor(Math.random() * (65 - 18 + 1)) + 18; // random age between 18 and 65
    const newDepartment = "Engineering";

    cy.get("#edit-record-1").should("be.visible").click();
    cy.get(".modal-content").should("be.visible");

    cy.get("#age").should("be.visible").clear();
    cy.get("#age").type(newAge);
    cy.get("#age").should("have.value", newAge);
    cy.get("#department").should("be.visible").clear();
    cy.get("#department").type(newDepartment);
    cy.get("#department").should("have.value", newDepartment);

    cy.get("#submit").click();
    cy.get(".modal-content").should("not.exist");

    cy.contains(".rt-tr-group", "Cierra").within(() => {
      cy.get(".rt-td").eq(2).should("contain", newAge);
      cy.get(".rt-td").eq(5).should("contain", newDepartment);
    });
  });

  it("add a new record", { tags: ["@webTables"] }, () => {
    const adrian = {
      firstName: "Adrian",
      lastName: "Jiga",
      email: "jiga.ion.adrian@gmail.com",
      age: "29",
      salary: "15000",
      department: "Engineering",
    };

    cy.get("#addNewRecordButton").click();
    cy.get(".modal-content").should("be.visible");
    cy.get("#registration-form-modal").should("contain", "Registration Form");

    cy.get("#firstName").type(adrian.firstName);
    cy.get("#firstName").should("have.value", adrian.firstName);
    cy.get("#lastName").type(adrian.lastName);
    cy.get("#lastName").should("have.value", adrian.lastName);
    cy.get("#userEmail").type(adrian.email);
    cy.get("#userEmail").should("have.value", adrian.email);
    cy.get("#age").type(adrian.age);
    cy.get("#age").should("have.value", adrian.age);
    cy.get("#salary").type(adrian.salary);
    cy.get("#salary").should("have.value", adrian.salary);
    cy.get("#department").type(adrian.department);
    cy.get("#department").should("have.value", adrian.department);

    cy.get("#submit").click();
    cy.get(".modal-content").should("not.exist");

    cy.get(".rt-tbody").within(() => {
      cy.contains(".rt-tr-group", adrian.firstName).within(() => {
        cy.get(".rt-td").eq(0).should("contain", adrian.firstName);
        cy.get(".rt-td").eq(1).should("contain", adrian.lastName);
        cy.get(".rt-td").eq(2).should("contain", adrian.age);
        cy.get(".rt-td").eq(3).should("contain", adrian.email);
        cy.get(".rt-td").eq(4).should("contain", adrian.salary);
        cy.get(".rt-td").eq(5).should("contain", adrian.department);
        cy.get(".rt-td").eq(6).find('span[title="Edit"]').should("exist");
        cy.get(".rt-td").eq(6).find('span[title="Delete"]').should("exist");
      });
    });
  });

  it("delete an existing record", { tags: ["@webTables"] }, () => {
    cy.get('.rt-tbody div[role="row"]')
      .not(".-padRow")
      .then(($rows) => {
        const initialRowCount = $rows.length;

        const secondRecord = {
          firstName: $rows.eq(1).find("div").eq(0).text(),
          lastName: $rows.eq(1).find("div").eq(1).text(),
          age: $rows.eq(1).find("div").eq(2).text(),
          email: $rows.eq(1).find("div").eq(3).text(),
          salary: $rows.eq(1).find("div").eq(4).text(),
          department: $rows.eq(1).find("div").eq(5).text(),
        };

        //delete first record
        cy.get("#delete-record-1").click();
        cy.get('.rt-tbody div[role="row"]')
          .not(".-padRow")
          .should("have.length", initialRowCount - 1);

        //check that the 2nd record moved up to the first row
        cy.get('.rt-tbody div[role="row"]')
          .not(".-padRow")
          .first()
          .within(($firstRow) => {
            cy.wrap($firstRow)
              .find("div")
              .eq(0)
              .should("have.text", secondRecord.firstName);
            cy.wrap($firstRow)
              .find("div")
              .eq(1)
              .should("have.text", secondRecord.lastName);
            cy.wrap($firstRow)
              .find("div")
              .eq(2)
              .should("have.text", secondRecord.age);
            cy.wrap($firstRow)
              .find("div")
              .eq(3)
              .should("have.text", secondRecord.email);
            cy.wrap($firstRow)
              .find("div")
              .eq(4)
              .should("have.text", secondRecord.salary);
            cy.wrap($firstRow)
              .find("div")
              .eq(5)
              .should("have.text", secondRecord.department);
          });
      });
  });

  it("change the number of rows displayed", { tags: ["@webTables"] }, () => {
    const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];

    rowsPerPageOptions.forEach((rowsPerPage) => {
      cy.get('select[aria-label="rows per page"]').select(
        `${rowsPerPage} rows`
      );
      cy.get('.rt-tbody div[role="row"]').should(
        "have.length.at.most",
        rowsPerPage
      );
      cy.get(".-totalPages").should("contain", "1");
    });
  });

  it(
    "pagination when more than 5 records exist",
    { tags: ["@webTables"] },
    () => {
      for (let i = 0; i < 3; i++) {
        cy.get("#addNewRecordButton").click();
        cy.get("#firstName").type(`User${i}`);
        cy.get("#lastName").type("Test");
        cy.get("#userEmail").type(`user${i}@test.com`);
        cy.get("#age").type("25");
        cy.get("#salary").type("1000");
        cy.get("#department").type("Test");
        cy.get("#submit").click();
      }

      cy.get('select[aria-label="rows per page"]').select("5 rows");
      cy.get(".-totalPages").should("contain", "2");
      cy.get(".-next").click();
      cy.get('.rt-tbody div[role="row"]').should("have.length.at.least", 1);
      cy.contains(".rt-tr-group", "User2").should("be.visible");
      cy.get(".-previous").should("not.be.disabled");
      cy.get(".-previous").click();
      cy.contains(".rt-tr-group", "Cierra").should("be.visible");
      cy.get(".-next").should("not.be.disabled");
    }
  );
});
