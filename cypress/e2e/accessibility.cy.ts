import { ButtonsPage, RegisterFormPage, WebTablesPage } from "../pages";
import { expectAccessibilityBaseline } from "../support/accessibility";

/**
 * Accessibility coverage for the helper pages, using the analyzer from the
 * WebQualityAnalyzer project (the same engine behind its browser extension).
 *
 * ## Why these tests have a baseline instead of asserting zero
 *
 * The helper pages have real, pre-existing accessibility defects. Asserting zero today would
 * make the suite red on arrival, which teaches everyone to ignore it. Instead each page
 * declares exactly what is currently wrong, and the assertion is two-way: a **new** issue
 * fails, and a baseline entry that stops occurring **also** fails so it must be deleted.
 *
 * The baseline is therefore a shrinking record of known debt, not a suppression list.
 *
 * ## Scope
 *
 * Accessibility only. SEO and performance are disabled in `cy.auditAccessibility()` — they
 * audit page quality, not the behaviour under test.
 */

/**
 * Known, accepted issues per page. Format: `type @ selector — message`.
 *
 * **All three pages are currently at zero**, and the analyzer is DOM-based, so these match
 * the Playwright suite's baselines exactly. If the two ever disagree, the difference is real
 * and worth understanding rather than papering over — the pages are the same pages.
 *
 * Adding an entry here is a deliberate act. Do it only with a comment saying why the issue is
 * acceptable, and treat it as debt to remove rather than a permanent exception.
 */
const BASELINE: Record<string, string[]> = {
  buttons: [],
  webTables: [],
  registerForm: [],
};

describe("Accessibility", () => {
  it("buttons page has no accessibility issues", { tags: ["@a11y"] }, () => {
    ButtonsPage.visit();

    cy.auditAccessibility().then(({ issues, score }) => {
      expectAccessibilityBaseline(issues, BASELINE.buttons);
      expect(score).to.equal(100);
    });
  });

  it("web tables page matches its accessibility baseline", {
    tags: ["@a11y"],
  }, () => {
    WebTablesPage.visit();

    cy.auditAccessibility().then(({ issues }) => {
      expectAccessibilityBaseline(issues, BASELINE.webTables);
    });
  });

  it("register form matches its accessibility baseline", {
    tags: ["@a11y"],
  }, () => {
    RegisterFormPage.visit();

    cy.auditAccessibility().then(({ issues }) => {
      expectAccessibilityBaseline(issues, BASELINE.registerForm);
    });
  });

  it("submitted-state register form reports no new issues", {
    tags: ["@a11y"],
  }, () => {
    // Auditing only the initial render misses whatever a page reveals at runtime — the
    // confirmation modal is hidden until submit, and it is where the heading-hierarchy
    // defect used to live.
    //
    // Date of birth is required for submission alongside first name, last name, mobile and
    // gender, and it cannot be typed — it must be picked. Omitting it leaves the form
    // blocked by validation and the modal shut.
    RegisterFormPage.visit();
    RegisterFormPage.fillCompleteForm({
      firstName: "Ada",
      lastName: "Lovelace",
      mobile: "1234567890",
      gender: "male",
      dateOfBirth: { month: "January", year: "1990", day: "01" },
    });
    RegisterFormPage.submit();
    RegisterFormPage.verifySubmissionSuccess();

    cy.auditAccessibility().then(({ issues }) => {
      expectAccessibilityBaseline(issues, BASELINE.registerForm);
    });
  });
});
