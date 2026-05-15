/**
 * Page Object for the Practice Form helper page
 * @see https://adrianjiga.github.io/qa/helpers/automation-practice-form
 */
export const RegisterFormPage = {
  url: "/qa/helpers/automation-practice-form",

  selectors: {
    firstName: '[data-cy="first-name-input"]',
    lastName: '[data-cy="last-name-input"]',
    email: '[data-cy="email-input"]',
    mobile: '[data-cy="mobile-input"]',
    genderMale: '[data-cy="gender-male"]',
    genderFemale: '[data-cy="gender-female"]',
    genderOther: '[data-cy="gender-other"]',
    genderLabel: (id) => {
      const map = {
        1: '[data-cy="gender-male-label"]',
        2: '[data-cy="gender-female-label"]',
        3: '[data-cy="gender-other-label"]',
      };
      return map[id];
    },
    dateOfBirthInput: '[data-cy="date-of-birth-input"]',
    monthSelect: '[data-cy="month-select"]',
    yearSelect: '[data-cy="year-select"]',
    daySelector: (day) => `[data-cy="day-${day}"]`,
    subjectsInput: '[data-cy="subjects-input"]',
    hobbySports: '[data-cy="hobby-sports"]',
    hobbyReading: '[data-cy="hobby-reading"]',
    hobbyMusic: '[data-cy="hobby-music"]',
    uploadPicture: '[data-cy="upload-picture"]',
    currentAddress: '[data-cy="address-input"]',
    stateDropdown: '[data-cy="state-dropdown"]',
    stateOption: (index) => `#state-option-${index}`,
    cityDropdown: '[data-cy="city-dropdown"]',
    cityOption: (index) => `#city-option-${index}`,
    submitButton: '[data-cy="submit-btn"]',
    closeModalButton: '[data-cy="close-modal-btn"]',
    modalTitle: '[data-cy="modal-title"]',
    resultTable: '[data-cy="result-table"] tbody tr',
  },

  messages: {
    formSubmitted: "Thanks for submitting the form",
  },

  validationColor: "rgb(220, 53, 69)",

  /**
   * Navigate to the Practice Form page
   */
  visit() {
    cy.visit(this.url);
    return this;
  },

  /**
   * Fill basic text fields
   * @param {Object} data - Form data
   */
  fillBasicInfo(data) {
    if (data.firstName) {
      cy.get(this.selectors.firstName).type(data.firstName);
    }
    if (data.lastName) {
      cy.get(this.selectors.lastName).type(data.lastName);
    }
    if (data.email) {
      cy.get(this.selectors.email).type(data.email);
    }
    if (data.mobile) {
      cy.get(this.selectors.mobile).type(data.mobile);
    }
    if (data.address) {
      cy.get(this.selectors.currentAddress).type(data.address);
    }
    return this;
  },

  /**
   * Select gender
   * @param {'male'|'female'|'other'} gender - Gender to select
   */
  selectGender(gender) {
    const genderMap = {
      male: this.selectors.genderMale,
      female: this.selectors.genderFemale,
      other: this.selectors.genderOther,
    };
    cy.get(genderMap[gender]).check({ force: true });
    return this;
  },

  /**
   * Select date of birth
   * @param {string} month - Month name (e.g., "January")
   * @param {string} year - Year (e.g., "1990")
   * @param {string} day - Day with leading zero (e.g., "01")
   */
  selectDateOfBirth(month, year, day) {
    cy.get(this.selectors.dateOfBirthInput).click();
    cy.get(this.selectors.monthSelect).select(month);
    cy.get(this.selectors.yearSelect).select(year);
    cy.get(this.selectors.daySelector(day)).first().click();
    return this;
  },

  /**
   * Add a subject
   * @param {string} subject - Subject to add
   */
  addSubject(subject) {
    cy.get(this.selectors.subjectsInput).type(`${subject}{enter}`);
    return this;
  },

  /**
   * Select hobbies
   * @param {Array<'sports'|'reading'|'music'>} hobbies - Hobbies to select
   */
  selectHobbies(hobbies) {
    const hobbyMap = {
      sports: this.selectors.hobbySports,
      reading: this.selectors.hobbyReading,
      music: this.selectors.hobbyMusic,
    };
    hobbies.forEach((hobby) => {
      cy.get(hobbyMap[hobby]).check({ force: true });
    });
    return this;
  },

  /**
   * Upload a picture file
   * @param {string} filePath - Path to the file (relative to fixtures)
   */
  uploadPicture(filePath) {
    cy.get(this.selectors.uploadPicture).selectFile(filePath);
    return this;
  },

  /**
   * Select state from dropdown
   * @param {number} optionIndex - Index of the state option (0-based)
   */
  selectState(optionIndex = 0) {
    cy.get(this.selectors.stateDropdown).click();
    cy.get(this.selectors.stateOption(optionIndex)).click();
    return this;
  },

  /**
   * Select city from dropdown
   * @param {number} optionIndex - Index of the city option (0-based)
   */
  selectCity(optionIndex = 0) {
    cy.get(this.selectors.cityDropdown).click();
    cy.get(this.selectors.cityOption(optionIndex)).click();
    return this;
  },

  /**
   * Submit the form
   */
  submit() {
    cy.waitAndClick(this.selectors.submitButton, { force: true });
    return this;
  },

  /**
   * Close the confirmation modal
   */
  closeModal() {
    cy.get(this.selectors.closeModalButton).click({ force: true });
    return this;
  },

  /**
   * Verify the confirmation modal is displayed
   */
  verifySubmissionSuccess() {
    cy.get(this.selectors.modalTitle)
      .should("be.visible")
      .and("contain", this.messages.formSubmitted);
    return this;
  },

  /**
   * Verify form data in the confirmation modal
   * @param {Object} expectedData - Key-value pairs of label and expected value
   */
  verifySubmittedData(expectedData) {
    Object.entries(expectedData).forEach(([label, value]) => {
      cy.get(this.selectors.resultTable)
        .contains("td", label)
        .next("td")
        .should("have.text", value);
    });
    return this;
  },

  /**
   * Verify validation error on a field
   * @param {string} selector - Field selector
   */
  verifyFieldValidationError(selector) {
    cy.get(selector).should("have.css", "border-color", this.validationColor);
    return this;
  },

  /**
   * Verify all required field validation errors
   */
  verifyRequiredFieldErrors() {
    this.verifyFieldValidationError(this.selectors.firstName);
    this.verifyFieldValidationError(this.selectors.lastName);
    this.verifyFieldValidationError(this.selectors.mobile);

    // Gender radio labels
    for (let i = 1; i <= 3; i++) {
      cy.get(this.selectors.genderLabel(i)).should(
        "have.css",
        "border-color",
        this.validationColor
      );
    }
    return this;
  },

  /**
   * Fill complete form with all fields
   * @param {Object} data - Complete form data
   */
  fillCompleteForm(data) {
    this.fillBasicInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
    });

    if (data.gender) {
      this.selectGender(data.gender);
    }

    if (data.dateOfBirth) {
      this.selectDateOfBirth(
        data.dateOfBirth.month,
        data.dateOfBirth.year,
        data.dateOfBirth.day
      );
    }

    if (data.subjects) {
      data.subjects.forEach((subject) => this.addSubject(subject));
    }

    if (data.hobbies) {
      this.selectHobbies(data.hobbies);
    }

    if (data.picture) {
      this.uploadPicture(data.picture);
    }

    if (data.state !== undefined) {
      this.selectState(data.state);
    }

    if (data.city !== undefined) {
      this.selectCity(data.city);
    }

    return this;
  },
};
