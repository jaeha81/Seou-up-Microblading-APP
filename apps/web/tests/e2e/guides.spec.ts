import { test, expect } from "@playwright/test";

test.describe("Guide Pages", () => {
  test("guide list page loads", async ({ page }) => {
    await page.goto("/en/guide");
    await expect(page).toHaveURL(/\/en\/guide/);
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });

  test("microblading 101 guide loads", async ({ page }) => {
    await page.goto("/en/guide/microblading-101");
    await expect(page).toHaveURL(/microblading-101/);
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("aftercare guide loads", async ({ page }) => {
    await page.goto("/en/guide/aftercare");
    await expect(page).toHaveURL(/aftercare/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("guide page has back link", async ({ page }) => {
    await page.goto("/en/guide/microblading-101");
    const backLink = page.getByRole("link", { name: /back|guide/i }).first();
    await expect(backLink).toBeVisible();
  });

  test("guide page has CTA to providers or simulator", async ({ page }) => {
    await page.goto("/en/guide/microblading-101");
    const cta = page.getByRole("link", { name: /providers|simulat/i }).first();
    await expect(cta).toBeVisible();
  });
});
