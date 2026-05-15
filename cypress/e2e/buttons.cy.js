import { ButtonsPage } from "../pages";

describe("Buttons", () => {
  beforeEach(() => {
    ButtonsPage.visit();
  });

  it(
    "should interact with double click button",
    { tags: ["@ui", "@smoke"] },
    () => {
      ButtonsPage.performDoubleClick().verifyDoubleClickMessage();
    }
  );

  it("should interact with right click button", { tags: ["@ui"] }, () => {
    ButtonsPage.performRightClick().verifyRightClickMessage();
  });

  it("should interact with dynamic button", { tags: ["@ui"] }, () => {
    ButtonsPage.performDynamicClick().verifyDynamicClickMessage();
  });
});
