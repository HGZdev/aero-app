import { test, expect } from "@playwright/test";

/**
 * Basic App Tests
 *
 * Fundamental tests that verify the basic functionality and structure
 * of the Aero Dashboard application. These tests ensure the core
 * components are working correctly before more complex scenarios.
 *
 * Features tested:
 * - Basic routing and navigation
 * - Page structure and layout
 * - Essential UI components
 * - Error handling
 * - Responsive design basics
 */
test.describe("Basic App Tests", () => {
  test("should redirect from / to /aero-app", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/aero-app");
  });

  test("should display navigation bar", async ({ page }) => {
    await page.goto("/aero-app");

    // Check if navigation elements are visible
    await expect(page.getByTestId("navigation")).toBeVisible();
    await expect(page.getByTestId("logo-link")).toBeVisible();
    await expect(page.getByTestId("nav-link-dashboard")).toBeVisible();
    await expect(page.getByTestId("nav-link-map")).toBeVisible();
    await expect(page.getByTestId("nav-link-flights")).toBeVisible();

    await expect(page.getByTestId("nav-link-flights")).toBeVisible();
  });

  test("should navigate between pages", async ({ page }) => {
    await page.goto("/aero-app");

    // Test navigation to Map page
    await page.getByTestId("nav-link-map").click();
    await expect(page).toHaveURL("/aero-app/map");
    await expect(page.getByTestId("map-title")).toBeVisible();

    // Test navigation to Flights page
    await page.getByTestId("nav-link-flights").click();
    await expect(page).toHaveURL("/aero-app/flights");
    await expect(page.getByTestId("flights-title")).toBeVisible();

    // Test navigation back to Dashboard
    await page.getByTestId("nav-link-dashboard").click();
    await expect(page).toHaveURL("/aero-app");
    await expect(page.getByTestId("dashboard-title")).toBeVisible();
  });

  test("should display dashboard page structure", async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if dashboard elements are visible
    await expect(page.getByTestId("dashboard-title")).toBeVisible();

    // Check if stats cards are present
    await expect(page.getByTestId("stat-aircraft-tracked")).toBeVisible();
    await expect(page.getByTestId("stat-countries")).toBeVisible();
    await expect(page.getByTestId("stat-avg-speed")).toBeVisible();
    await expect(page.getByTestId("stat-avg-altitude")).toBeVisible();
  });

  test("should display map page", async ({ page }) => {
    await page.goto("/aero-app/map");
    await page.waitForLoadState("domcontentloaded");

    // Check if map page elements are visible
    await expect(page.getByTestId("map-title")).toBeVisible();
    await expect(page.getByTestId("map-subtitle")).toBeVisible();

    // Wait for map to load
    await page.waitForSelector(".leaflet-container", { timeout: 10000 });

    // Check if map container is visible
    await expect(page.getByTestId("map-container")).toBeVisible();
  });

  test("should display flights list page", async ({ page }) => {
    await page.goto("/aero-app/flights");
    await page.waitForLoadState("domcontentloaded");

    // Check if flights list page elements are visible
    await expect(page.getByTestId("flights-title")).toBeVisible();
    await expect(page.getByTestId("flights-subtitle")).toBeVisible();

    // Check if search and filter elements are present
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByTestId("country-filter")).toBeVisible();
    await expect(page.getByTestId("sort-select")).toBeVisible();
  });

  test("should handle 404 page", async ({ page }) => {
    await page.goto("/aero-app/nonexistent-page");

    // Check if 404 page is displayed
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page Not Found")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if navigation is still visible and functional
    await expect(page.getByTestId("navigation")).toBeVisible();
    await expect(page.getByTestId("logo-link")).toBeVisible();

    // Check if dashboard content is visible
    await expect(page.getByTestId("dashboard-title")).toBeVisible();
  });
});
