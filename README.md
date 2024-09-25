# Demo Website Cypress Testing Project

This project contains automated tests for the Demo Registration Website using Cypress. It aims to ensure the functionality and reliability of key features through comprehensive end-to-end testing.

## Features Tested

- User Registration Form
- Form Validation
- User Table Display
- Pagination
- Tab Navigation

## Prerequisites

Before running the tests, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/your-username/demo-website-testing.git
   cd demo-website-testing
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Tests

To run the tests in headless mode:

```
npm run test
```

To open the Cypress Test Runner:

```
npm run cypress:open
```

## Test Structure

The tests are located in the `cypress/e2e` directory. The test file is `demo.cy.js`, which contains test cases for various features of the demo website.

## Configuration

The Cypress configuration is in `cypress.config.js`.

## Continuous Integration

This project is set up to run tests automatically on push using GitHub Actions. The configuration for this can be found in `.github/workflows/cypress.yml`.

## Acknowledgments

- Thanks to the Cypress team for providing an excellent testing framework.
- Shoutout to all contributors who help improve this testing suite.
