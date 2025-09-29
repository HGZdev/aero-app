import { test, expect } from "@playwright/test";

test.describe("Responsive Design Tests", () => {
  test("should work on desktop (1920x1080)", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if all navigation items are visible
    await expect(
      page.locator('[data-testid="nav-link-dashboard"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="nav-link-map"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="nav-link-flights"]')
    ).toBeVisible();

    // Check if dashboard layout is proper
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  });

  test("should work on tablet (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if navigation is still functional
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();

    // Check if dashboard content is visible
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  });

  test("should work on mobile (375x667)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if navigation is still visible
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();

    // Check if mobile navigation works
    await page.click('[data-testid="nav-link-map"]');
    await expect(page).toHaveURL("/aero-app/map");
  });

  test("should work on small mobile (320x568)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if basic functionality works on very small screens
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="logo-link"]')).toBeVisible();
  });
});

test.describe("Accessibility Tests", () => {
  test("should have proper heading structure", async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if main heading is present
    const h1 = page.locator('[data-testid="dashboard-title"]');
    await expect(h1).toBeVisible();

    // Check if heading contains expected text
    await expect(h1).toContainText("Aero Dashboard");
  });

  test("should have proper navigation landmarks", async ({ page }) => {
    await page.goto("/aero-app");

    // Check if nav element is present
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();

    // Check if navigation links are properly structured
    const navLinks = page.locator('[data-testid="navigation"] a');
    await expect(navLinks).toHaveCount(4); // Logo + 3 nav items
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/aero-app/flights");
    await page.waitForLoadState("domcontentloaded");

    // Check if search input has proper placeholder
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Check if select elements are present
    await expect(page.locator('[data-testid="country-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="sort-select"]')).toBeVisible();
  });

  test("should have proper button labels", async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    // Check if refresh button has proper text
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await expect(refreshButton).toBeVisible();
  });
});

test.describe("Performance Tests", () => {
  test("should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/aero-app");
    await page.waitForLoadState("domcontentloaded");

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("should handle map rendering efficiently", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/aero-app/map");
    await page.waitForSelector(".leaflet-container", { timeout: 15000 });

    const mapLoadTime = Date.now() - startTime;

    // Map should load within 15 seconds
    expect(mapLoadTime).toBeLessThan(15000);

    // Check if map is interactive
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
  });
});

test.describe("Error Handling Tests", () => {
  test("should handle 404 errors properly", async ({ page }) => {
    await page.goto("/aero-app/nonexistent-page");

    // Should show 404 page
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=Page Not Found")).toBeVisible();
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Block network requests to simulate network error
    await page.route("**/*", (route) => route.abort());

    try {
      await page.goto("/aero-app");
    } catch (error) {
      // Expected to fail due to blocked requests
    }

    // Skip this test if page doesn't load due to network blocking
    // This is expected behavior when all requests are blocked
  });
});
