import { test, expect } from "@playwright/test";

test.describe("Brow Simulator Page", () => {
  test("loads simulator page", async ({ page }) => {
    await page.goto("/en/simulate");
    await expect(page).toHaveURL(/\/en\/simulate/);
    // Should have some heading or upload area
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });

  test("shows upload area or photo input", async ({ page }) => {
    await page.goto("/en/simulate");
    // Either a file input or a visible upload zone
    const fileInput = page.locator('input[type="file"]');
    const uploadZone = page.getByText(/upload|photo|image/i).first();
    const hasInput = await fileInput.count() > 0;
    const hasUploadText = await uploadZone.isVisible().catch(() => false);
    expect(hasInput || hasUploadText).toBeTruthy();
  });
});
