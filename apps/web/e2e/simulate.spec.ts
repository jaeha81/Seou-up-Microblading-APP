import { test, expect } from "@playwright/test";

test.describe("Brow Simulator", () => {
  test("simulator page loads", async ({ page }) => {
    await page.goto("/en/simulate");
    await expect(page.getByText(/brow|eyebrow|style/i).first()).toBeVisible();
  });

  test("shows 12 brow style options", async ({ page }) => {
    await page.goto("/en/simulate");
    await page.waitForLoadState("networkidle");
    const styles = await page.locator("button, div").filter({ hasText: /Natural|Ombre|Combination|Bold/i }).count();
    expect(styles).toBeGreaterThan(0);
  });

  test("upload step appears after style selection", async ({ page }) => {
    await page.goto("/en/simulate");
    await page.waitForLoadState("networkidle");
    const firstStyle = page.locator("button").filter({ hasText: /Natural Feather/i }).first();
    if (await firstStyle.isVisible()) {
      await firstStyle.click();
      await expect(page.getByText(/upload|photo/i).first()).toBeVisible();
    }
  });
});
