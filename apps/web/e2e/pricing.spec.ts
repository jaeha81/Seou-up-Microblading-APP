import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test("pricing page loads", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.getByRole("heading", { name: /pricing|plans|grow/i }).first()).toBeVisible();
  });

  test("shows free and featured plans", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.getByText("Free Listing")).toBeVisible();
    await expect(page.getByText("Featured Pro")).toBeVisible();
  });

  test("free plan CTA links to register", async ({ page }) => {
    await page.goto("/en/pricing");
    const freeBtn = page.getByRole("link", { name: /get started free/i });
    await expect(freeBtn).toBeVisible();
    await expect(freeBtn).toHaveAttribute("href", /register/);
  });
});
