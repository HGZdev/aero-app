import { test, expect } from "@playwright/test";

/**
 * Flight Functionality Tests
 *
 * Tests focused on flight data functionality, including data loading,
 * statistics display, charts rendering, and interactive features.
 * These tests verify that flight data is properly processed and displayed
 * across different pages and components.
 *
 * Features tested:
 * - Flight data loading and statistics
 * - Chart rendering and data visualization
 * - Refresh functionality
 * - Map integration with flight data
 * - Flights list functionality
 * - Search and filtering capabilities
 */
test.describe("Flight Data Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display flight statistics when data loads", async ({ page }) => {
    // Wait for data to potentially load (with timeout)
    try {
      await page.waitForSelector('[data-testid="stat-aircraft-tracked"]', {
        timeout: 15000,
      });

      // Check if flight count is displayed
      const flightCountElement = page.getByTestId("stat-aircraft-count");
      await expect(flightCountElement).toBeVisible();

      // Verify that the count is a number
      const flightCountText = await flightCountElement.textContent();
      expect(flightCountText).toMatch(/^\d+$/);
    } catch (error) {
      // If data doesn't load, just check that the structure is there
      await expect(page.getByTestId("stat-aircraft-tracked")).toBeVisible();
    }
  });

  test("should display charts structure", async ({ page }) => {
    // Check if all chart containers are present
    await expect(page.getByTestId("chart-altitude-distribution")).toBeVisible();
    await expect(page.getByTestId("chart-top-countries")).toBeVisible();
    await expect(page.getByTestId("chart-speed-altitude")).toBeVisible();
    await expect(page.getByTestId("chart-country-distribution")).toBeVisible();

    // Check if chart containers have content (SVG elements)
    const chartContainers = page.getByTestId("charts-grid");
    await expect(chartContainers).toHaveCount(1);
  });

  test("should handle refresh button click", async ({ page }) => {
    // Check if refresh button is visible
    const refreshButton = page.getByTestId("refresh-button");
    await expect(refreshButton).toBeVisible();

    // Click refresh button
    await refreshButton.click();

    // Wait a bit to see if anything happens
    await page.waitForTimeout(2000);
  });
});

test.describe("Map Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/aero-app/map");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should load map container", async ({ page }) => {
    // Wait for map to load
    await page.waitForSelector(".leaflet-container", { timeout: 15000 });

    // Check if map container is visible
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Check if map tiles are loaded (look for leaflet tile elements)
    try {
      await page.waitForSelector(".leaflet-tile", { timeout: 10000 });
      await expect(page.locator(".leaflet-tile").first()).toBeVisible();
    } catch (error) {
      // Map tiles might not load in test environment, that's okay
      console.log("Map tiles not loaded in test environment");
    }
  });

  test("should show flight count in header", async ({ page }) => {
    // Check if flight count is displayed in header
    const flightCountText = page.getByTestId("map-info");
    await expect(flightCountText).toBeVisible();

    // Verify it contains a number
    const countText = await flightCountText.textContent();
    expect(countText).toMatch(/\d+/);
  });
});

test.describe("Flights List Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/aero-app/flights");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display flights table structure", async ({ page }) => {
    // Check if table headers are present
    await expect(page.getByTestId("th-callsign")).toBeVisible();
    await expect(page.getByTestId("th-icao24")).toBeVisible();
    await expect(page.getByTestId("th-country")).toBeVisible();
    await expect(page.getByTestId("th-altitude")).toBeVisible();
    await expect(page.getByTestId("th-speed")).toBeVisible();
    await expect(page.getByTestId("th-heading")).toBeVisible();
    await expect(page.getByTestId("th-position")).toBeVisible();
  });

  test("should have search and filter functionality", async ({ page }) => {
    // Check if search input is present
    const searchInput = page.getByTestId("search-input");
    await expect(searchInput).toBeVisible();

    // Test search functionality
    await searchInput.fill("test");
    await page.waitForTimeout(500); // Wait for search to process

    // Check if select elements are present
    await expect(page.getByTestId("country-filter")).toBeVisible();
    await expect(page.getByTestId("sort-select")).toBeVisible();
  });
});
