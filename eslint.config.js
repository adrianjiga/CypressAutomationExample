import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import cypress from "eslint-plugin-cypress";

export default [
  js.configs.recommended,
  {
    files: [
      "cypress/e2e/**/*.cy.js",
      "cypress/support/**/*.js",
      "cypress/pages/**/*.js",
    ],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, "readonly"])
        ),
        ...Object.fromEntries(
          Object.entries(globals.node).map(([key]) => [key, "readonly"])
        ),
        ...Object.fromEntries(
          Object.entries(globals.es2021).map(([key]) => [key, "readonly"])
        ),
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        context: "readonly",
        describe: "readonly",
        it: "readonly",
        specify: "readonly",
      },
    },
    plugins: {
      cypress: cypress,
    },
    rules: {
      ...cypress.configs.recommended.rules,
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "cypress/no-assigning-return-values": "error",
      "cypress/no-unnecessary-waiting": "error",
      "cypress/assertion-before-screenshot": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  prettier,
];