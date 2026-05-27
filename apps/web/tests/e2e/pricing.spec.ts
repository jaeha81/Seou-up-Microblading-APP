import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test("pricing page loads with plan cards", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.getByRole("heading", { name: /Grow Your Studio/i })).toBeVisible();
  });

  test("shows Free and Featured Pro plans", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.getByText("Free Listing")).toBeVisible();
    await expect(page.getByText("Featured Pro")).toBeVisible();
  });

  test("free plan has Get Started CTA linking to register", async ({ page }) => {
    await page.goto("/en/pricing");
    const freeBtn = page.getByRole("link", { name: /Get Started Free/i });
    await expect(freeBtn).toBeVisible();
    const href = await freeBtn.getAttribute("href");
    expect(href).toMatch(/register/);
  });

  test("featured plan has upgrade button", async ({ page }) => {
    await page.goto("/en/pricing");
    const upgradeBtn = page.getByRole("button", { name: /Upgrade to Featured/i });
    await expect(upgradeBtn).toBeVisible();
  });

  test("shows Stripe payment note", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.getByText(/Secure Payments via Stripe/i)).toBeVisible();
  });

  test("featured plan badge is visible", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.getByText(/Most Popular/i)).toBeVisible();
  });
});
