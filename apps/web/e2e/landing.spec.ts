import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Seou-up/i);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("has navigation links", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("link", { name: /simulate/i }).first()).toBeVisible();
  });

  test("shows 4 language options", async ({ page }) => {
    await page.goto("/en");
    for (const lang of ["EN", "KO", "TH", "VI"]) {
      await expect(page.getByText(lang).first()).toBeVisible();
    }
  });

  test("CTA button navigates to simulator", async ({ page }) => {
    await page.goto("/en");
    const cta = page.getByRole("link", { name: /simulate/i }).first();
    await cta.click();
    await expect(page).toHaveURL(/\/en\/simulate/);
  });
});
