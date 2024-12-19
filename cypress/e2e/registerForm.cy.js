describe("Register Form", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (_err, _runnable) => {
      return false;
    });

    cy.visit("/automation-practice-form");
  });

  it("should submit the practice form with all fields", { tags: "@ui" }, () => {
    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe");
    cy.get("#userEmail").type("john@example.com");
    cy.get("#gender-radio-1").check({ force: true });
    cy.get("#userNumber").type("1234567890");
    cy.get("#dateOfBirthInput").click();
    cy.get(".react-datepicker__month-select").select("January");
    cy.get(".react-datepicker__year-select").select("1990");
    cy.get("#dateOfBirth div.react-datepicker__day.react-datepicker__day--001")
      .first()
      .click();
    cy.get("#subjectsInput").type("Maths{enter}");
    cy.get("#hobbies-checkbox-1").check({ force: true });
    cy.get("#hobbies-checkbox-2").check({ force: true });
    cy.get("#uploadPicture").selectFile("cypress/fixtures/book.json");
    cy.get("#currentAddress").type("123 Test Street");
    cy.get("#state").click();
    cy.get("#react-select-3-option-0").click();
    cy.get("#city").click();
    cy.get("#react-select-4-option-0").click();
    cy.get("#submit").click({ force: true });

    cy.get("#example-modal-sizes-title-lg")
      .should("be.visible")
      .and("contain", "Thanks for submitting the form");

    const expectedData = {
      "Student Name": "John Doe",
      "Student Email": "john@example.com",
      Gender: "Male",
      Mobile: "1234567890",
      "Date of Birth": "01 January,1990",
      Subjects: "Maths",
      Hobbies: "Sports, Reading",
      Picture: "book.json",
      Address: "123 Test Street",
      "State and City": "NCR Delhi",
    };

    Object.entries(expectedData).forEach(([label, value]) => {
      cy.get("table tbody tr")
        .contains("td", label)
        .next("td")
        .should("have.text", value);
    });

    cy.get("#closeLargeModal").click({ force: true });
  });

  it(
    "should show validation errors for required fields",
    { tags: "@ui" },
    () => {
      cy.get("#submit").click({ force: true });
      cy.get("#firstName").should(
        "have.css",
        "border-color",
        "rgb(220, 53, 69)"
      );
      cy.get("#lastName").should(
        "have.css",
        "border-color",
        "rgb(220, 53, 69)"
      );
      for (let i = 1; i < 3; i++) {
        cy.get(`label[for="gender-radio-${i}"]`).should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
      }
      cy.get("#userNumber").should(
        "have.css",
        "border-color",
        "rgb(220, 53, 69)"
      );
    }
  );
});
