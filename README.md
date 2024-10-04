# Demo Website Cypress Testing Project

This project contains examples of automated tests using Cypress, demonstrating both end-to-end testing and API testing capabilities. It serves as a learning resource and reference for implementing Cypress tests in various scenarios.

## Features Tested

- User Registration Form
- Form Validation
- User Table Display
- Pagination
- Tab Navigation
- API Endpoints

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

The tests are located in the `cypress/e2e` directory. The main test files are:

- `demo.cy.js`: Contains test cases for various UI features of the demo website.
- `api.cy.js`: Contains API tests using the default Cypress API testing approach.
- `api-plugin.cy.js`: Contains API tests using the cypress-plugin-api.

## Configuration

The Cypress configuration is in `cypress.config.js`.

## API Testing

This project includes two approaches for API testing:

1. Default Cypress API testing (`api.cy.js`)
2. Testing with cypress-plugin-api (`api-plugin.cy.js`)

The cypress-plugin-api is already installed and configured in this project.

## Acknowledgments

- Thanks to the Cypress team for providing an excellent testing framework.
- Appreciation to the creators of cypress-plugin-api for enhancing API testing capabilities.
- Shoutout to all contributors who help improve this testing suite.
