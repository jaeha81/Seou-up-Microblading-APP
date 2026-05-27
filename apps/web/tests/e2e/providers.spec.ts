import { test, expect } from "@playwright/test";

test.describe("Providers Page", () => {
  test("loads provider list", async ({ page }) => {
    await page.goto("/en/providers");
    await expect(page.getByRole("heading", { name: /Find Certified Providers/i })).toBeVisible();
  });

  test("shows disclaimer banner", async ({ page }) => {
    await page.goto("/en/providers");
    await expect(page.getByText(/Disclaimer/i).first()).toBeVisible();
  });

  test("map toggle button exists", async ({ page }) => {
    await page.goto("/en/providers");
    // Wait for providers to load
    await page.waitForTimeout(1500);
    const mapBtn = page.getByRole("button", { name: /Map/i });
    await expect(mapBtn).toBeVisible();
  });

  test("list/map toggle switches view", async ({ page }) => {
    await page.goto("/en/providers");
    await page.waitForTimeout(1500);
    const mapBtn = page.getByRole("button", { name: /Map/i });
    await mapBtn.click();
    // Map container should appear (leaflet)
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 5000 });
  });

  test("CTA to list studio is visible", async ({ page }) => {
    await page.goto("/en/providers");
    await expect(page.getByRole("link", { name: /List.*Studio|List Free/i }).first()).toBeVisible();
  });
});
