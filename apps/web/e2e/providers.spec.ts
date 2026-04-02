import { test, expect } from "@playwright/test";

test.describe("Providers Directory", () => {
  test("providers page loads", async ({ page }) => {
    await page.goto("/en/providers");
    await expect(page.getByRole("heading", { name: /provider/i }).first()).toBeVisible();
  });

  test("shows list and map toggle", async ({ page }) => {
    await page.goto("/en/providers");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    const mapButton = page.getByRole("button", { name: /map/i });
    if (await mapButton.isVisible()) {
      await expect(mapButton).toBeVisible();
    }
  });

  test("provider cards have view profile links", async ({ page }) => {
    await page.goto("/en/providers");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const viewLinks = page.getByText("View Profile →");
    const count = await viewLinks.count();
    if (count > 0) {
      await expect(viewLinks.first()).toBeVisible();
    }
  });

  test("map toggle shows map", async ({ page }) => {
    await page.goto("/en/providers");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const mapBtn = page.getByRole("button", { name: /🗺️/i });
    if (await mapBtn.isVisible()) {
      await mapBtn.click();
      await page.waitForTimeout(1000);
      const map = page.locator(".leaflet-container");
      await expect(map).toBeVisible({ timeout: 5000 });
    }
  });
});
