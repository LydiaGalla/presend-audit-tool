# Testing Documentation

## Overview
This project includes a suite of 16 automated tests across 3 test files, covering unit behavior, input validation, and edge cases for the `/api/audit` route.

## Test Stack
- **Jest** — test runner
- **@testing-library/jest-dom** — DOM assertion matchers
- **jest.unstable_mockModule** — ESM-compatible mocking for the Anthropic SDK

## Running the Tests

```bash
npm test
```

## Test Files

### `__tests__/route.test.js` — Core Route Tests
Tests the fundamental behavior of the POST /api/audit endpoint.

| Test | What it verifies |
|------|-----------------|
| Returns 400 when content is missing | Required field validation |
| Returns 400 when content exceeds 10000 characters | Input size cap |
| Returns 200 with valid input | Happy path |
| Normalizes readabilityIssues to array | Array normalization fix |
| Returns readabilityScore between 1 and 10 | Score range validation |

### `__tests__/validation.test.js` — Input Validation Tests
Tests that all required fields are enforced server-side.

| Test | What it verifies |
|------|-----------------|
| Returns 400 when contentType is missing | Required field validation |
| Returns 400 when demographic is missing | Required field validation |
| Returns 400 when content is empty string | Empty input rejection |
| Accepts SMS as valid content type | SMS support |
| Response always contains complianceChecks array | Array normalization |
| Response always contains readabilitySuggestions array | Array normalization |

### `__tests__/edge-cases.test.js` — Edge Case Tests
Tests behavior when the model returns unexpected output shapes.

| Test | What it verifies |
|------|-----------------|
| Handles model returning string instead of array for readabilityIssues | Crash prevention |
| Handles model returning string instead of array for complianceChecks | Crash prevention |
| Handles very short SMS content | Minimum input handling |
| Handles content at exactly 10000 characters | Boundary condition |
| Response structure always has readabilityVerdict | Required field presence |

## Why These Tests Matter
The most critical bug class in this application is the model returning unexpected output shapes — for example, returning `"None"` as a string instead of an empty array when no issues are found. Without normalization and testing, this causes a blank page crash that loses the user's input entirely. These tests verify that normalization is working correctly and that the API behaves predictably regardless of model output variation.

## What Would Be Added Next
- **E2E tests** using Playwright to simulate a full user interaction in the browser
- **UI component tests** using React Testing Library for the results display cards
- **Rate limiting tests** once rate limiting is implemented
- **Regression tests** tied to specific bugs as they are discovered and fixed