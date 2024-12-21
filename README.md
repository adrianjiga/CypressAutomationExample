# Cypress Automation Example

This project demonstrates automated testing using Cypress, showcasing both UI and API testing capabilities using the DemoQA website as the application under test.

## Overview

The project contains end-to-end tests for:
- UI interactions with buttons and forms
- Table operations (search, edit, delete)
- API testing for a book store service
- Waiting pattern examples with Cypress docs

## Prerequisites

- Node.js (v20.0.0 or higher)
- npm (v10.0.0 or higher)
- Docker (if running tests in containers)

## Project Structure

```
cypress/
├── e2e/                  # Test files
│   ├── api.cy.js         # Book Store API tests
│   ├── api-plugin.cy.js  # JSONPlaceholder API example
│   ├── buttons.cy.js     # Button interaction tests
│   ├── webTables.cy.js   # Web table operations
│   ├── registerForm.cy.js # Form submission tests
│   └── wait-until-example.cy.js
├── fixtures/             # Test data
│   └── book.json        
└── support/             # Support files
    ├── commands.js      # Custom commands
    └── e2e.js          # Global configuration
```

## Test Categories

### UI Tests (`@ui` tag)
- Button interactions
  - Double click
  - Right click
  - Dynamic click
- Registration form
  - Field validation
  - Form submission
  - Error states
- Cypress docs search with waitUntil

### API Tests (`@api` tag)
- Book Store API
  - List all books
  - Get specific book
  - Handle invalid ISBN
- JSONPlaceholder example

### Web Tables Tests (`@webTables` tag)
- CRUD operations
  - Search functionality
  - Edit records
  - Add new records
  - Delete records
- Pagination
- Rows per page configuration

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/adrianjiga/CypressAutomationExample
cd CypressAutomationExample
```

2. Install dependencies:
```bash
npm install
```

## Running Tests

### Local Execution

1. Run UI tests:
```bash
npm run test:ui
```

2. Run API tests:
```bash
npm run test:api
```

3. Run WebTables tests:
```bash
npm run test:webtables
```

4. Run all tests:
```bash
npm run cypress:run
```

5. Run UI tests through Docker:
```bash
npm run test:docker:ui
```

6. Run API tests through Docker:
```bash
npm run test:docker:api
```

7. Run WebTables tests through Docker:
```bash
npm run test:docker:webtables
```

8. Run all tests through Docker:
```bash
npm run test:docker
```

## Test Reports

Reports are generated using Mochawesome and can be found in:
- UI tests: `reports/ui/`
- API tests: `reports/api/`
- WebTables tests: `reports/webtables/`
- Combined report: `reports/final/`

## Code Quality Tools

### ESLint Configuration
- Semi-colons required
- Double quotes
- 2-space indentation
- No unused variables
- Cypress-specific rules enabled

Run linting:
```bash
npm run lint        # Check for issues
npm run lint:fix    # Fix issues automatically
```

### Prettier Configuration
Run formatting:
```bash
npm run format         # Format files
npm run format:check   # Check formatting
```

## Docker Resources

Each test suite runs in a container with:
- Base image: `cypress/included:13.6.1`
- Memory limits: `2GB`
- Memory reservation: `1GB`

## Configuration

### Cypress Configuration (cypress.config.js)
- Viewport: `1920x1080`
- Base URL: https://demoqa.com
- Retries: `2` attempts
- Video recording: `disabled`
- Grep plugin `enabled` for test filtering

## Author

Adrian Jiga

## License

ISC