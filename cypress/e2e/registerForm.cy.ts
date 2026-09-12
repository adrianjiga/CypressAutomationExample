import { RegisterFormPage } from "../pages";
import { userFactory } from "../support/factories";

describe("Register Form", () => {
  beforeEach(() => {
    RegisterFormPage.visit();
  });

  it("should submit the practice form with all fields", {
    tags: ["@ui", "@smoke"],
  }, () => {
    const testUser = userFactory.generateFormUser();

    RegisterFormPage.fillCompleteForm({
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      mobile: testUser.mobile,
      address: testUser.address,
      gender: "male",
      dateOfBirth: { month: "January", year: "1990", day: "01" },
      subjects: ["Maths"],
      hobbies: ["sports", "reading"],
      picture: "cypress/fixtures/book.json",
      state: "Germany",
      city: "Berlin",
    });

    RegisterFormPage.submit().verifySubmissionSuccess();

    const expectedData: Record<string, string> = {
      "Student Name": `${testUser.firstName} ${testUser.lastName}`,
      "Student Email": testUser.email,
      Gender: "Male",
      Mobile: testUser.mobile,
      "Date of Birth": "01 January,1990",
      Subjects: "Maths",
      Hobbies: "Sports, Reading",
      Picture: "book.json",
      Address: testUser.address,
      "State and City": "Germany Berlin",
    };

    RegisterFormPage.verifySubmittedData(expectedData).closeModal();
  });

  it("should show validation errors for required fields", {
    tags: ["@ui"],
  }, () => {
    RegisterFormPage.submit().verifyRequiredFieldErrors();
  });
});
