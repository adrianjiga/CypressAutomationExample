/**
 * Page Object for the Practice Form helper page
 * @see https://adrianjiga.github.io/qa/helpers/automation-practice-form
 */
export const RegisterFormPage = {
  url: "/qa/helpers/automation-practice-form",

  selectors: {
    firstName: '[data-cy="firstNameInput"]',
    lastName: '[data-cy="lastNameInput"]',
    email: '[data-cy="emailInput"]',
    mobile: '[data-cy="mobileInput"]',
    genderMale: '[data-cy="genderMale"]',
    genderFemale: '[data-cy="genderFemale"]',
    genderOther: '[data-cy="genderOther"]',
    genderLabel: (id) => {
      const map = {
        1: '[data-cy="genderMaleLabel"]',
        2: '[data-cy="genderFemaleLabel"]',
        3: '[data-cy="genderOtherLabel"]',
      };
      return map[id];
    },
    dateOfBirthInput: '[data-cy="dateOfBirthInput"]',
    monthSelect: '[data-cy="monthSelect"]',
    yearSelect: '[data-cy="yearSelect"]',
    daySelector: (day) => `[data-cy="day${day}"]`,
    subjectsInput: '[data-cy="subjectsInput"]',
    hobbySports: '[data-cy="hobbySports"]',
    hobbyReading: '[data-cy="hobbyReading"]',
    hobbyMusic: '[data-cy="hobbyMusic"]',
    uploadPicture: '[data-cy="uploadPicture"]',
    currentAddress: '[data-cy="addressInput"]',
    stateDropdown: '[data-cy="stateDropdown"]',
    stateOption: (country) =>
      `[data-cy="stateOption${country.replace(/\s+/g, "")}"]`,
    cityDropdown: '[data-cy="cityDropdown"]',
    cityOption: (city) => `[data-cy="cityOption${city.replace(/\s+/g, "")}"]`,
    submitButton: '[data-cy="submitBtn"]',
    closeModalButton: '[data-cy="closeModalBtn"]',
    modalTitle: '[data-cy="modalTitle"]',
    resultTable: '[data-cy="resultTable"] tbody tr',
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
    cy.selectDate(this.selectors.dateOfBirthInput, month, year, day);
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
   * Select a country from the custom dropdown.
   *
   * Addressed by name rather than position: the old `#state-option-N` ids encoded an
   * ordering the spec had to know but never stated, so `selectState(0)` silently meant
   * Germany.
   *
   * @param {'Germany'|'France'|'Spain'|'Italy'|'Netherlands'} country - the visible name
   */
  selectState(country = "Germany") {
    cy.get(this.selectors.stateDropdown).click();
    cy.get(this.selectors.stateOption(country)).click();
    return this;
  },

  /**
   * Select a city from the custom dropdown. Cities are populated by the chosen country, so
   * this must run after {@link selectState}.
   *
   * The hook is the visible name with spaces removed and capitalisation preserved, matching
   * how the page builds the attribute, so "Frankfurt" is `cityOptionFrankfurt` and "The
   * Hague" is `cityOptionTheHague`.
   *
   * @param {string} city - the visible name, e.g. "Berlin"
   */
  selectCity(city = "Berlin") {
    cy.get(this.selectors.cityDropdown).click();
    cy.get(this.selectors.cityOption(city)).click();
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
    cy.verifyValidationError(selector, this.validationColor);
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
      cy.verifyCssProperty(
        this.selectors.genderLabel(i),
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
