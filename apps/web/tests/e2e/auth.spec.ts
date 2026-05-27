import { test, expect } from "@playwright/test";

test.describe("Auth Pages", () => {
  test("register page loads", async ({ page }) => {
    await page.goto("/en/auth/register");
    await expect(page).toHaveURL(/\/en\/auth\/register/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("register form has required fields", async ({ page }) => {
    await page.goto("/en/auth/register");
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/en/auth/login");
    await expect(page).toHaveURL(/\/en\/auth\/login/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("login form has required fields", async ({ page }) => {
    await page.goto("/en/auth/login");
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
  });

  test("register page links to login", async ({ page }) => {
    await page.goto("/en/auth/register");
    const loginLink = page.getByRole("link", { name: /log.*in|sign.*in/i }).first();
    await expect(loginLink).toBeVisible();
  });
});
