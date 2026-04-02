import { test, expect } from "@playwright/test";

test.describe("Startup Guide", () => {
  test("guide listing page loads", async ({ page }) => {
    await page.goto("/en/guide");
    await expect(page.getByRole("heading", { name: /guide/i }).first()).toBeVisible();
  });

  test("shows guide articles", async ({ page }) => {
    await page.goto("/en/guide");
    await expect(page.getByText(/read/i).first()).toBeVisible();
  });

  test("clicking Read navigates to guide detail", async ({ page }) => {
    await page.goto("/en/guide");
    const readBtn = page.getByRole("link", { name: /read/i }).first();
    await readBtn.click();
    await expect(page).toHaveURL(/\/en\/guide\/.+/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("guide detail has back link", async ({ page }) => {
    await page.goto("/en/guide/microblading-business-basics");
    await expect(page.getByText(/back to guide/i)).toBeVisible();
  });

  test("guide detail shows disclaimer", async ({ page }) => {
    await page.goto("/en/guide/microblading-business-basics");
    await expect(page.getByText(/educational content only/i)).toBeVisible();
  });
});
