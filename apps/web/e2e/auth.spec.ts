import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("register page renders", async ({ page }) => {
    await page.goto("/en/auth/register");
    await expect(page.getByText(/role/i).first()).toBeVisible();
  });

  test("login page renders", async ({ page }) => {
    await page.goto("/en/auth/login");
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("login rejects invalid credentials", async ({ page }) => {
    await page.goto("/en/auth/login");
    await page.fill('input[type="email"]', "invalid@test.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid|incorrect|error/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("register shows role selection step", async ({ page }) => {
    await page.goto("/en/auth/register");
    await expect(page.getByText(/consumer|pro artist|entrepreneur/i).first()).toBeVisible();
  });
});
