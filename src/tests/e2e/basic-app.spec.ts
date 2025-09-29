import { test, expect } from "@playwright/test";

test.describe("Basic App Tests", () => {
  test("should redirect from / to /aero-app", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/aero-app");
  });

  test("should display navigation bar", async ({ page }) => {
    await page.goto("/aero-app");

    // Check if navigation elements are visible
    await expect(page.locator("nav")).toBeVisible();
    await expect(
      page.locator('nav a:has-text("Aero Dashboard")')
    ).toBeVisible();
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
    await expect(page.locator("text=Map")).toBeVisible();
    await expect(page.locator("text=Flights")).toBeVisible();
  });

  test("should navigate between pages", async ({ page }) => {
    await page.goto("/aero-app");

    // Test navigation to Map page
    await page.click("text=Map");
    await expect(page).toHaveURL("/aero-app/map");
    await expect(page.locator("text=Live Flight Map")).toBeVisible();

    // Test navigation to Flights page
    await page.click("text=Flights");
    await expect(page).toHaveURL("/aero-app/flights");
    await expect(page.locator("text=Flights List")).toBeVisible();

    // Test navigation back to Dashboard
    await page.click("text=Dashboard");
    await expect(page).toHaveURL("/aero-app");
    await expect(page.locator('h1:has-text("Aero Dashboard")')).toBeVisible();
  });

  test("should display dashboard page structure", async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if dashboard elements are visible
    await expect(page.locator('h1:has-text("Aero Dashboard")')).toBeVisible();

    // Check if stats cards are present
    await expect(page.locator("text=Aircraft Tracked")).toBeVisible();
    await expect(page.locator('p:has-text("Countries")')).toBeVisible();
    await expect(page.locator("text=Avg Speed")).toBeVisible();
    await expect(page.locator("text=Avg Altitude")).toBeVisible();
  });

  test("should display map page", async ({ page }) => {
    await page.goto("/aero-app/map");
    await page.waitForLoadState("domcontentloaded");

    // Check if map page elements are visible
    await expect(page.locator("text=Live Flight Map")).toBeVisible();
    await expect(
      page.locator("text=Real-time aircraft positions")
    ).toBeVisible();

    // Wait for map to load
    await page.waitForSelector(".leaflet-container", { timeout: 10000 });

    // Check if map container is visible
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });

  test("should display flights list page", async ({ page }) => {
    await page.goto("/aero-app/flights");
    await page.waitForLoadState("domcontentloaded");

    // Check if flights list page elements are visible
    await expect(page.locator("text=Flights List")).toBeVisible();
    await expect(
      page.locator("text=Detailed aircraft information")
    ).toBeVisible();

    // Check if search and filter elements are present
    await expect(
      page.locator('input[placeholder*="Search by callsign"]')
    ).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();
  });

  test("should handle 404 page", async ({ page }) => {
    await page.goto("/aero-app/nonexistent-page");

    // Check if 404 page is displayed
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=Page Not Found")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if navigation is still visible and functional
    await expect(page.locator("nav")).toBeVisible();
    await expect(
      page.locator('nav a:has-text("Aero Dashboard")')
    ).toBeVisible();

    // Check if dashboard content is visible
    await expect(page.locator('h1:has-text("Aero Dashboard")')).toBeVisible();
  });
});
