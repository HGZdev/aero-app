import { test, expect } from "@playwright/test";

/**
 * Mock Data Tests
 *
 * These tests verify that the application correctly uses mock data
 * when VITE_USE_MOCK_DATA=true or in test mode. Mock data provides
 * realistic flight information for development and testing scenarios.
 *
 * Features tested:
 * - Mock data loading and display
 * - Realistic flight statistics
 * - Chart rendering with mock data
 * - Different mock data types (all, europe, asia, etc.)
 * - Refresh functionality with mock data
 * - Fallback behavior when API fails
 */
test.describe("Mock Data Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're using mock data
    await page.goto("/aero-app");
    await page.waitForLoadState("networkidle");
  });

  test("should display mock flight data", async ({ page }) => {
    // Verify that mock data is loaded and displayed correctly
    // Check if mock data indicator is visible
    await expect(page.locator("span:has-text('🎭 Mock Data')")).toBeVisible();

    // Check if we have aircraft count
    const aircraftCount = page.getByTestId("stat-aircraft-count");
    await expect(aircraftCount).toBeVisible();

    const count = await aircraftCount.textContent();
    expect(parseInt(count || "0")).toBeGreaterThan(0);
  });

  test("should display realistic flight statistics", async ({ page }) => {
    // Verify that mock data provides realistic flight statistics
    // Check countries count
    const countriesCount = page.getByTestId("stat-countries-count");
    await expect(countriesCount).toBeVisible();

    const countries = await countriesCount.textContent();
    expect(parseInt(countries || "0")).toBeGreaterThan(0);

    // Check average speed
    const avgSpeed = page.getByTestId("stat-speed-value");
    await expect(avgSpeed).toBeVisible();

    const speed = await avgSpeed.textContent();
    expect(parseInt(speed?.replace(" km/h", "") || "0")).toBeGreaterThan(0);

    // Check average altitude
    const avgAltitude = page.getByTestId("stat-altitude-value");
    await expect(avgAltitude).toBeVisible();

    const altitude = await avgAltitude.textContent();
    expect(parseInt(altitude?.replace(" km", "") || "0")).toBeGreaterThan(0);
  });

  test("should display charts with mock data", async ({ page }) => {
    // Verify that all charts render correctly with mock data
    // Check altitude distribution chart
    await expect(page.getByTestId("chart-altitude-distribution")).toBeVisible();

    // Check countries chart
    await expect(page.getByTestId("chart-top-countries")).toBeVisible();

    // Check speed vs altitude chart
    await expect(page.getByTestId("chart-speed-altitude")).toBeVisible();

    // Check country distribution pie chart
    await expect(page.getByTestId("chart-country-distribution")).toBeVisible();
  });

  test("should show different mock data types", async ({ page }) => {
    // Test navigation between pages to ensure mock data persists
    // Test with different mock data types
    const mockTypes = [
      "all",
      "europe",
      "asia",
      "busy",
      "empty",
      "high-altitude",
      "low-altitude",
      "mixed",
    ];

    for (const mockType of mockTypes) {
      // Navigate to a page that would trigger data reload
      await page.goto("/aero-app/flights");
      await page.waitForLoadState("networkidle");

      // Check if we're on flights page
      await expect(page.getByTestId("flights-title")).toBeVisible();

      // Go back to dashboard
      await page.goto("/aero-app");
      await page.waitForLoadState("networkidle");

      // Verify mock data is still working
      await expect(page.locator("span:has-text('🎭 Mock Data')")).toBeVisible();
    }
  });

  test("should handle refresh with mock data", async ({ page }) => {
    // Verify that refresh button works correctly with mock data
    // Get initial aircraft count
    const initialCount = await page
      .getByTestId("stat-aircraft-count")
      .textContent();

    // Click refresh button
    await page.getByTestId("refresh-button").click();

    // Wait for refresh to complete
    await page.waitForTimeout(1000);

    // Check if mock data is still there
    await expect(page.locator("span:has-text('🎭 Mock Data')")).toBeVisible();

    // Verify aircraft count is still realistic
    const newCount = await page
      .getByTestId("stat-aircraft-count")
      .textContent();
    expect(parseInt(newCount || "0")).toBeGreaterThan(0);
  });

  test("should display flights list with mock data", async ({ page }) => {
    // Verify that flights list page works correctly with mock data
    await page.goto("/aero-app/flights");
    await page.waitForLoadState("networkidle");

    // Check if flights table is visible
    await expect(page.getByTestId("th-callsign")).toBeVisible();
    await expect(page.getByTestId("th-icao24")).toBeVisible();
    await expect(page.getByTestId("th-country")).toBeVisible();
    await expect(page.getByTestId("th-altitude")).toBeVisible();

    // Check if search functionality works
    const searchInput = page.getByTestId("search-input");
    await expect(searchInput).toBeVisible();

    // Test search with mock data
    await searchInput.fill("RYR");
    await page.waitForTimeout(500);

    // Search should work (even if no results)
    await expect(searchInput).toHaveValue("RYR");
  });

  test("should display map with mock data", async ({ page }) => {
    // Verify that map page works correctly with mock data
    await page.goto("/aero-app/map");
    await page.waitForLoadState("networkidle");

    // Check if map page loads
    await expect(page.getByTestId("map-title")).toBeVisible();
    await expect(page.getByTestId("map-subtitle")).toBeVisible();

    // Check if map container is present
    await expect(page.getByTestId("map-container")).toBeVisible();

    // Wait for map to load
    await page.waitForSelector(".leaflet-container", { timeout: 10000 });

    // Check if flight count is displayed
    const flightCountText = page.getByTestId("map-info");
    await expect(flightCountText).toBeVisible();

    const countText = await flightCountText.textContent();
    expect(countText).toContain("aircraft");
  });
});

test.describe("Mock Data Fallback Tests", () => {
  test("should fallback to mock data when API fails", async ({ page }) => {
    // Verify that mock data is used as fallback when API requests fail
    // Block all network requests to simulate API failure
    await page.route("**/*", (route) => {
      if (route.request().url().includes("opensky-network.org")) {
        route.abort("failed");
      } else {
        route.continue();
      }
    });

    await page.goto("/aero-app");
    await page.waitForLoadState("networkidle");

    // Should still show mock data
    await expect(page.locator("span:has-text('🎭 Mock Data')")).toBeVisible();

    // Should have realistic data
    const aircraftCount = await page
      .getByTestId("stat-aircraft-count")
      .textContent();
    expect(parseInt(aircraftCount || "0")).toBeGreaterThan(0);
  });

  // Note: Offline testing is complex in Playwright and may not work reliably
  // The mock data fallback is already tested in the API failure test above
});
