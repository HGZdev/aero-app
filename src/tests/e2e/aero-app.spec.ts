import { test, expect } from "@playwright/test";

test.describe("Aero App E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto("/");
  });

  test("should redirect from / to /aero-app", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/aero-app");
  });

  test("should display navigation bar", async ({ page }) => {
    await page.goto("/aero-app");

    // Check if navigation elements are visible
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="nav-link-dashboard"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="nav-link-map"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="nav-link-flights"]')
    ).toBeVisible();
  });

  test("should navigate between pages", async ({ page }) => {
    await page.goto("/aero-app");

    // Test navigation to Map page
    await page.click('[data-testid="nav-link-map"]');
    await expect(page).toHaveURL("/aero-app/map");
    await expect(page.locator('[data-testid="map-title"]')).toBeVisible();

    // Test navigation to Flights page
    await page.click('[data-testid="nav-link-flights"]');
    await expect(page).toHaveURL("/aero-app/flights");
    await expect(page.locator('[data-testid="flights-title"]')).toBeVisible();

    // Test navigation back to Dashboard
    await page.click('[data-testid="nav-link-dashboard"]');
    await expect(page).toHaveURL("/aero-app");
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  });

  test("should display dashboard with basic elements", async ({ page }) => {
    await page.goto("/aero-app");

    // Wait for basic page load (not networkidle to avoid timeout)
    await page.waitForLoadState("domcontentloaded");

    // Check if dashboard elements are visible
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="dashboard-subtitle"]')
    ).toBeVisible();

    // Check if stats cards are present (even if empty)
    await expect(
      page.locator('[data-testid="stat-aircraft-tracked"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="stat-countries"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-avg-speed"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="stat-avg-altitude"]')
    ).toBeVisible();

    // Check if charts are present
    await expect(
      page.locator('[data-testid="chart-altitude-distribution"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="chart-top-countries"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="chart-speed-altitude"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="chart-country-distribution"]')
    ).toBeVisible();
  });

  test("should display refresh button", async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if refresh button is visible
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await expect(refreshButton).toBeVisible();
  });

  test("should display map page", async ({ page }) => {
    await page.goto("/aero-app/map");
    await page.waitForLoadState("domcontentloaded");

    // Check if map page elements are visible
    await expect(page.locator('[data-testid="map-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="map-subtitle"]')).toBeVisible();

    // Wait for map to load
    await page.waitForSelector(".leaflet-container", { timeout: 10000 });

    // Check if map container is visible
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
  });

  test("should display flights list page", async ({ page }) => {
    await page.goto("/aero-app/flights");
    await page.waitForLoadState("domcontentloaded");

    // Check if flights list page elements are visible
    await expect(page.locator('[data-testid="flights-title"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="flights-subtitle"]')
    ).toBeVisible();

    // Check if search and filter elements are present
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="country-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="sort-select"]')).toBeVisible();
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
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();

    // Check if dashboard content is visible
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  });
});
