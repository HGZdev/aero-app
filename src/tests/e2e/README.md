# E2E Tests for Aero App

This directory contains end-to-end tests for the Aero App using Playwright.

## Test Structure

### Test Files

- **`aero-app.spec.ts`** - Basic navigation and page functionality tests
- **`flight-functionality.spec.ts`** - Flight data, API, and specific feature tests
- **`responsive-accessibility.spec.ts`** - Responsive design, accessibility, and performance tests

### Test Categories

#### 1. Basic Functionality (`aero-app.spec.ts`)

- URL redirection (`/` → `/aero-app`)
- Navigation bar display and functionality
- Page navigation between Dashboard, Map, and Flights
- Dashboard content display
- Refresh button functionality
- Map page loading
- Flights list with filtering
- 404 page handling
- Mobile responsiveness
- Offline state handling

#### 2. Flight Data & API (`flight-functionality.spec.ts`)

- Flight data loading and statistics display
- Chart rendering with data
- Data source indicators (cached/mock/auto-refresh)
- Refresh functionality
- Map with flight markers and popups
- Flights list table with search and filtering
- Sorting functionality

#### 3. Responsive Design & Accessibility (`responsive-accessibility.spec.ts`)

- Desktop (1920x1080) layout
- Tablet (768x1024) layout
- Mobile (375x667) layout
- Small mobile (320x568) layout
- Heading structure
- Navigation landmarks
- Form labels
- Button labels
- Keyboard navigation
- Performance benchmarks
- Error handling

## Running Tests

### Prerequisites

Make sure you have installed Playwright browsers:

```bash
npx playwright install
```

### Available Commands

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test aero-app.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests in specific viewport
npx playwright test --project="Mobile Chrome"
```

### Test Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Auto-start dev server**: Tests automatically start the dev server
- **Parallel execution**: Tests run in parallel for faster execution
- **Retries**: 2 retries on CI, 0 locally

### Test Data

Tests work with real flight data from the OpenSky API. The tests:

- Wait for network requests to complete
- Handle loading states
- Test with actual flight data
- Verify data display and functionality

### Debugging Tests

1. **Use UI Mode**: `npm run test:e2e:ui` for interactive debugging
2. **Use Debug Mode**: `npm run test:e2e:debug` to step through tests
3. **Use Headed Mode**: `npm run test:e2e:headed` to see browser actions
4. **Add Screenshots**: Tests automatically capture screenshots on failure
5. **View Traces**: Use `npx playwright show-trace` to view detailed traces

### Test Reports

After running tests, you can view detailed reports:

```bash
npx playwright show-report
```

### CI/CD Integration

Tests are configured to run in CI environments:

- Automatic retries on failure
- Single worker for stability
- Proper error reporting
- Screenshot and trace capture on failure

## Writing New Tests

When adding new tests:

1. **Follow naming convention**: `*.spec.ts`
2. **Use descriptive test names**: `should display flight data correctly`
3. **Group related tests**: Use `test.describe()` for organization
4. **Wait for elements**: Always wait for elements to be visible/loaded
5. **Handle async operations**: Use proper waiting strategies
6. **Test different viewports**: Include mobile and desktop tests
7. **Test error scenarios**: Include error handling tests

### Example Test Structure

```typescript
test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/aero-app");
    await page.waitForLoadState("networkidle");
  });

  test("should do something specific", async ({ page }) => {
    // Test implementation
    await expect(page.locator("selector")).toBeVisible();
  });
});
```

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or add proper waits
2. **Elements not found**: Check selectors and wait for elements
3. **Network issues**: Use `waitForLoadState('networkidle')`
4. **Flaky tests**: Add proper waits and retries

### Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Wait for network requests** before asserting
3. **Test user workflows** not just individual components
4. **Include accessibility tests** for better UX
5. **Test error scenarios** for robustness
6. **Use page object pattern** for complex tests
7. **Keep tests independent** and isolated
