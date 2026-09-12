/**
 * Accessibility auditing built on the WebQualityAnalyzer project — the same engine that
 * drives its browser extension, published as a plain browser bundle for exactly this use.
 *
 * @see https://github.com/adrianjiga/WebQualityAnalyzer
 */

interface A11yIssue {
  type: string;
  message: string;
  severity: "high" | "medium" | "low";
  selector?: string;
  htmlSnippet?: string;
}

/**
 * The bundle source, read once per spec run rather than once per audit. `cy.readFile` hits
 * the Node process on every call, and the file is the same on all of them.
 */
let bundleSource: string | undefined;

/**
 * The bundle assigns its global at runtime, which static analysis cannot see. The cast
 * borrows the package's own emitted declarations rather than reaching for `any`, so the shape
 * of the analysis result stays checked.
 */
function analyzerIn(
  win: Cypress.AUTWindow
): typeof import("webqualityanalyzer") | undefined {
  return (
    win as Cypress.AUTWindow & {
      WebQualityAnalyzer?: typeof import("webqualityanalyzer");
    }
  ).WebQualityAnalyzer;
}

/**
 * Injects the analyzer bundle into the application window.
 *
 * It must be evaluated in the window's **global** scope: the bundle is an IIFE whose first
 * statement is `var WebQualityAnalyzer`, so anywhere else that assignment stays local and the
 * global never appears. A `<script>` element is the unambiguous way to get global scope —
 * `cy.window().then(win => win.eval(src))` also works, because a method call on `win` is an
 * *indirect* eval, but that is a subtlety a reader has to know rather than see.
 */
function injectAnalyzer(win: Cypress.AUTWindow): void {
  if (analyzerIn(win)) {
    return;
  }
  const script = win.document.createElement("script");
  script.textContent = bundleSource;
  win.document.head.appendChild(script);
}

/**
 * Runs the analyzer against the page currently under test and yields its accessibility
 * findings.
 *
 * SEO and performance are switched off deliberately. They audit the *page*, not the
 * behaviour under test, and their findings (a missing meta description, an unminified
 * script) are not defects of a QA helper fixture — including them would make this suite fail
 * over things it has no opinion about.
 *
 * `analyzePage` is synchronous, so the result is available in the same tick as the call.
 */
Cypress.Commands.add("auditAccessibility", () => {
  const withSource = bundleSource
    ? cy.wrap(bundleSource, { log: false })
    : cy
        .readFile(Cypress.expose("wqaBundlePath"), { log: false })
        .then((src) => {
          bundleSource = src;
          return src;
        });

  return withSource.then(() =>
    cy.window({ log: false }).then((win) => {
      injectAnalyzer(win);
      const analyzer = analyzerIn(win);
      if (!analyzer) {
        throw new Error("WebQualityAnalyzer bundle did not become available");
      }
      return analyzer.analyzePage({
        seo: { enabled: false },
        performance: { enabled: false },
      }).categories.accessibility;
    })
  );
});

/**
 * Full-fidelity identity for an issue: any change to type, location, or message is a change.
 *
 * Deliberately the same format as the Playwright suite's, so a finding can be compared across
 * repositories by eye without translating between two notations.
 */
function fingerprint(issue: A11yIssue): string {
  return `${issue.type} @ ${issue.selector ?? "(page)"} — ${issue.message}`;
}

/**
 * Asserts the page's accessibility findings match `baseline` exactly.
 *
 * This is a two-way check, and the second direction is the important one:
 *
 * 1. An issue **not** in the baseline fails — a new accessibility regression.
 * 2. A baseline entry that **no longer occurs** also fails — the debt was paid, so the
 *    entry must go.
 *
 * Without (2) a baseline is just a suppression list: it only ever grows, and nothing ever
 * tells you an entry became obsolete. With it, fixing the page *forces* the baseline to
 * shrink, so the file stays an accurate record of known debt rather than a graveyard.
 *
 * A page with no known issues passes `[]` and is held at zero from then on.
 */
export function expectAccessibilityBaseline(
  issues: A11yIssue[],
  baseline: string[]
): void {
  const found = issues.map(fingerprint);

  const regressions = found.filter((f) => !baseline.includes(f));
  expect(
    regressions,
    "New accessibility issue(s) not in the baseline. Fix the page, or — if this is genuinely " +
      "acceptable — add the exact string(s) to the baseline with a comment explaining why"
  ).to.deep.equal([]);

  const resolved = baseline.filter((b) => !found.includes(b));
  expect(
    resolved,
    "Baseline entr(ies) no longer reported — the page was fixed. Remove them so the baseline " +
      "keeps reflecting reality"
  ).to.deep.equal([]);
}
