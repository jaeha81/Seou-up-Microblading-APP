import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Seou-up|Microblading/i);
    // Hero heading or key CTA text should be visible
    const hero = page.locator("h1").first();
    await expect(hero).toBeVisible();
  });

  test("navbar has Providers and Simulate links", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("link", { name: /providers/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /simulat/i }).first()).toBeVisible();
  });

  test("navigates to providers page", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: /providers/i }).first().click();
    await expect(page).toHaveURL(/\/en\/providers/);
  });
});
