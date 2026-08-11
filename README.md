# Cypress Automation Example

A production-ready Cypress testing framework demonstrating UI, API, and table interaction testing patterns against self-hosted helper pages at [adrianjiga.github.io/qa/helpers](https://adrianjiga.github.io/qa/helpers). Features Page Object Model architecture, test data factories, multi-browser support, responsive testing, and CI/CD integration.

## Features

- **Page Object Model** - Clean separation of test logic and page interactions
- **Test Data Factories** - Dynamic test data generation with Faker.js
- **Multi-Browser Testing** - Chrome, Firefox, and Edge support
- **Responsive Testing** - Mobile, tablet, and desktop viewport configurations
- **API Testing** - RESTful API validation with schema verification
- **Docker Support** - Containerized test execution
- **CI/CD Ready** - GitHub Actions workflows for automated testing
- **Mochawesome Reports** - HTML test reports with screenshots and videos
- **Test Filtering** - Tag-based test execution with @cypress/grep

## Prerequisites

- Node.js v20.0.0 or higher
- npm v10.0.0 or higher
- Docker (optional, for containerized execution)

## Installation

```bash
git clone https://github.com/adrianjiga/CypressAutomationExample
cd CypressAutomationExample
npm install
```

## Project Structure

```
├── cypress/
│   ├── e2e/                          # Test specifications
│   │   ├── api.cy.js                 # JSONPlaceholder API tests
│   │   ├── buttons.cy.js             # Button interaction tests
│   │   ├── registerForm.cy.js        # Form validation tests
│   │   ├── waitUntilExample.cy.js    # Custom wait patterns
│   │   └── webTables.cy.js           # Table CRUD operations
│   ├── fixtures/                     # Test data files
│   │   ├── book.json                 # Upload payload for the register form
│   │   ├── post.json                 # Expected body for the get-by-id API test
│   │   └── schemas/                  # Ajv JSON Schemas (draft-07), keyed by $id
│   │       ├── comment-schema.json
│   │       ├── comments-array-schema.json
│   │       ├── post-schema.json
│   │       └── posts-array-schema.json
│   ├── pages/                        # Page Object Models
│   │   ├── ButtonsPage.js
│   │   ├── RegisterFormPage.js
│   │   ├── WebTablesPage.js
│   │   └── index.js
│   └── support/
│       ├── commands.js               # Custom Cypress commands
│       ├── e2e.js                    # Global configuration
│       ├── factories.js              # Test data factories
│       └── index.d.ts                # TypeScript definitions
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # PR validation workflow
│   │   └── cypress-tests.yml         # Main test execution workflow
│   ├── CODEOWNERS
│   └── dependabot.yml
├── cypress.config.js                 # Cypress configuration
├── docker-compose.yml                # Docker services
├── Dockerfile
├── eslint.config.js                  # ESLint configuration
├── jsconfig.json                     # JavaScript/IDE configuration
├── tsconfig.json                     # TypeScript configuration
├── .nvmrc                            # Node version pin (22), matches CI
├── .prettierrc
├── LICENSE
└── package.json
```

## Running Tests

### Interactive Mode

```bash
npm run cypress:open
```

### Headless Execution

```bash
# Run all tests
npm run test:all

# Run by tag
npm run test:ui           # UI tests (@ui)
npm run test:api          # API tests (@api)
npm run test:webtables    # Table tests (@webTables)
npm run test:smoke        # Smoke tests (@smoke)
```

### Browser Selection

```bash
npm run test:browser:chrome
npm run test:browser:firefox
npm run test:browser:edge
```

### Viewport Testing

```bash
npm run test:viewport:mobile    # 375x667
npm run test:viewport:tablet    # 768x1024
npm run test:viewport:desktop   # 1920x1080
```

### Docker Execution

```bash
# Individual test suites
npm run test:docker:ui
npm run test:docker:api
npm run test:docker:webtables

# All tests with report generation
npm run test:docker:all

# Cleanup
npm run docker:clean
```

## Test Categories

### UI Tests (`@ui`)

| Test File | Coverage |
|-----------|----------|
| `buttons.cy.js` | Double click, right click, dynamic click interactions |
| `registerForm.cy.js` | Form validation, field errors, complete submission |
| `waitUntilExample.cy.js` | Custom wait patterns with cypress-wait-until |

### API Tests (`@api`)

| Test File | Coverage |
|-----------|----------|
| `api.cy.js` | JSONPlaceholder API - list posts, fetch by ID, filter comments, error handling, create, delete |

Responses are validated against JSON Schema (draft-07) with Ajv. Every schema in
`cypress/fixtures/schemas/` carries an `$id`, and all of them are registered against a single
Ajv instance in `commands.js`. That is what lets an array schema `$ref` its item schema
(`posts-array` → `post`) instead of duplicating the item shape, and lets specs validate by
name rather than by import:

```javascript
cy.validateSchema(response.body, "posts-array");
```

Ajv runs with `allErrors: true`, so a failing assertion reports every violation with its
JSON path — not just the first one it hits.

### Web Tables Tests (`@webTables`)

| Test File | Coverage |
|-----------|----------|
| `webTables.cy.js` | Search, edit, add, delete records, pagination, rows per page |

## Page Objects

The framework uses Page Object Model for maintainable test code:

```javascript
import { ButtonsPage } from "../pages";

describe("Buttons", () => {
  beforeEach(() => {
    ButtonsPage.visit();
  });

  it("should interact with double click button", { tags: ["@ui"] }, () => {
    ButtonsPage
      .performDoubleClick()
      .verifyDoubleClickMessage();
  });
});
```

### Convention: object literals, not classes

Page objects are exported as plain object literals rather than ES6 classes. This is deliberate. Cypress tests typically work with a single instance per page — there is no `new ButtonsPage()` lifecycle to model, and the chainable methods (`return this`) work identically on a singleton. The companion Playwright project in this portfolio uses classes because Playwright passes a fresh `page` fixture into each test, which fits a constructor-per-test shape; Cypress does not.

## Test Data Factories

Generate dynamic test data with Faker.js:

```javascript
import { userFactory } from "../support/factories";

const user = userFactory.generate();
// { firstName, lastName, email, age, salary, department }

const engineer = userFactory.generate({ department: "Engineering" });
// Same shape, with the given fields overridden

const formUser = userFactory.generateFormUser();
// { firstName, lastName, email, mobile, address }

const age = userFactory.generateAge();
// Random integer in [18, 65]
```

## Custom Commands

Defined in `cypress/support/commands.js`, typed in `cypress/support/index.d.ts`.

### UI Interactions
- `cy.waitAndClick(selector, options)` - Wait for visibility then click
- `cy.selectDate(input, month, year, day)` - Date picker selection

### Assertions
- `cy.verifyCssProperty(selector, property, value)` - CSS validation
- `cy.verifyValidationError(selector, errorColor?)` - Form error styling

### API Helpers
- `cy.apiRequest(method, url, options)` - Request with default headers, `failOnStatusCode: false`
- `cy.validateSchema(data, schema)` - Ajv draft-07 validation, reporting every violation at once

### Utilities
- `cy.logMessage(message, data?)` - Log to both the Cypress runner and the console
- `cy.takeScreenshot(name, options?)` - Timestamped screenshot

Form-filling is **not** a custom command. Each page object owns its own form logic
(`RegisterFormPage.fillCompleteForm()`, `WebTablesPage.fillForm()`) because the two forms
have different field sets and different validation semantics — a shared `fillForm` command
collapsed into a lowest-common-denominator helper that neither page could use cleanly.

## Configuration

### Base URL

The helper pages live at `https://adrianjiga.github.io` and are wired in `cypress.config.js`:

```javascript
e2e: {
  baseUrl: "https://adrianjiga.github.io",
}
```

### Viewport Presets

| Name | Dimensions |
|------|------------|
| mobile | 375 x 667 |
| tablet | 768 x 1024 |
| desktop | 1920 x 1080 |

### Test Retries

- Run mode: 2 retries
- Open mode: 0 retries

## CI/CD

### Pull Request Validation (`ci.yml`)

Runs on every PR to master:
- Linting
- Format checking
- Cypress verification
- Smoke tests

### Scheduled Test Execution (`cypress-tests.yml`)

- **Schedule**: Monday-Friday at 07:00 UTC
- **Triggers**: Push to master, manual dispatch

Three jobs:

| Job | Shape |
|-----|-------|
| `test` | Groups (`@api`, `@ui`, `@webTables`) × Browsers (Chrome, Firefox) at the desktop viewport. `@api` is skipped on Firefox — the suite makes no browser-specific assertions, so a second engine buys nothing. |
| `responsive-tests` | `@ui` only, on Chrome, at the mobile and tablet viewports. Separate from the main matrix so viewport coverage doesn't multiply against the browser axis. |
| `merge-reports` | Runs after both (`if: always()`), downloads every shard's artifacts and merges the mochawesome JSON into a single HTML report. |

All `actions/*` references are pinned to full commit SHAs with a trailing `# vX.Y.Z` comment.
SHAs are immutable, so a compromised tag cannot silently re-point at different code.
Dependabot recognises the pattern and bumps the SHA and the comment together.

### Artifacts

Test artifacts are retained for 30 days:
- Screenshots (on failure)
- Videos — recorded for every spec, then deleted for passing specs by the `after:spec`
  hook in `cypress.config.js`, so only failures survive
- Mochawesome reports

## Reports

### Generate Reports

```bash
# Merge all JSON reports
npm run report:merge

# Generate HTML report
npm run report:generate

# Both steps
npm run report:full
```

### Report Locations

Per-spec mochawesome JSON/HTML reports are written to `reports/` (filename pattern: `[status]_[datetime]-[name]-report`). Running `npm run report:full` merges them into `reports/final/`.

## Code Quality

### Linting

```bash
npm run lint          # Check issues
npm run lint:fix      # Auto-fix issues
```

### Formatting

```bash
npm run format        # Format files
npm run format:check  # Verify formatting
```

### Type Checking

```bash
npm run typecheck     # Run TypeScript checks
```

## Docker Configuration

Each test container runs with:
- Base image: `cypress/included:15.18.1`
- Memory limit: 2GB
- Memory reservation: 1GB

### The image tag and the npm dependency are one pin, not two

`cypress/included:X` ships a pre-downloaded Cypress binary for X in the image's binary
cache. The Dockerfile then runs `npm ci`, which installs whatever `package-lock.json`
resolves. **These must be the same version.** If they diverge, the npm package looks for a
binary that isn't in the cache and the container dies before a single spec runs.

Dependabot watches both, on the same weekly schedule, but raises them as separate PRs —
merge them together. Any version held back in the npm `ignore` list must be held back in
the docker one too; `.github/dependabot.yml` keeps the two entries adjacent and cross-
referenced for that reason.

The six-line Dockerfile is deliberate. `docker-compose.yml` bind-mounts the working tree
over `/app` and declares a per-service `command:`, so under compose the `COPY . .` and
`CMD` are redundant — they exist so that a plain `docker build` + `docker run` also works.
The anonymous `/app/node_modules` volume is what stops the bind mount from shadowing the
container's installed dependencies.

## Dependency Management

Dependabot monitors and updates:
- npm packages (weekly, Mondays)
- Docker images (weekly, Mondays)
- GitHub Actions (weekly, Mondays)

Updates are grouped per ecosystem, so a week's bumps arrive as one PR rather than six.

**Held-back versions** are recorded in `.github/dependabot.yml` with the reason inline.
Currently: `cypress@15.19.0`, which ships `@babel/preset-typescript` without a
`package.json`, so the bundled preprocessor cannot resolve it and every spec dies at 0ms
(see PR #162). Remove the entry once a fixed release is out.

## Cleanup

```bash
npm run clean          # Remove reports, videos, screenshots, cache
npm run clean:reports  # Remove reports only
npm run docker:clean   # Remove Docker volumes and orphans
```

## Author

**Adrian Jiga**  
[GitHub](https://github.com/adrianjiga) | [Email](mailto:jiga.ion.adrian@gmail.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.