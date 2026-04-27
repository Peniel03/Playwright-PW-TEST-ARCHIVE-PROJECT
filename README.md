# Playwright-PW-TEST-ARCHIVE-PROJECT

# Playwright Automation Task : Negotiator Registration

# Negotiator Account Registration - Playwright Automation Test

## Overview
This project implements automated end-to-end testing for the Negotiator Account Registration workflow using Playwright with TypeScript. The test validates the complete registration flow including email verification through Mailcatcher and account activation.

## What Was Implemented

### 1. **Negotiator Account Registration Test** (`tests/negotiator-registration.test.ts`)
A complete end-to-end test covering:
- User registration with form validation
- Avatar file upload
- Email confirmation page verification
- Email verification via Mailcatcher
- Account activation through email link
- Profile page verification

### 2. **Page Object Model (POM) Structure**
- **LoginPage** (`pages/login-page.ts`) - Handles login and account creation navigation
- **RegistrationPage** (`pages/registration-page.ts`) - Manages registration form interactions
- **MailCatcherPage** (`pages/mail-catcher-page.ts`) - Handles Mailcatcher email verification
- **BasePage** (`pages/base-page.ts`) - Base class with shared utilities
- **SimHeaderPanel** (`panels/sim-header-panel.ts`) - UI panel components

### 3. **Logging System**
- Centralized logger utility (`utils/logger.ts`) for all test steps
- Info-level logging for major actions
- Helps with debugging and test result analysis

### 4. **Configuration Management**
- Centralized config file (`configs/config.ts`)
- Environment-based URLs and credentials
- Easy to switch between environments (dev, QA, production)

### 5. **Multi-Browser Support**
- Chromium, Edge, and Firefox support
- HTML reporting with screenshots and videos
- Configured in `playwright.config.ts`

## Why It Was Implemented This Way

### **Page Object Model (POM)**
- **Reason**: Separates UI element locators from test logic
- **Benefit**: Makes tests more maintainable; changes to UI only require updates in one place
- **Example**: When Mailcatcher changed how it displays emails (in iframe), only `MailCatcherPage.ts` needed updates, not the test itself

### **Waiting Strategies**
```typescript
1. await this.page.waitForLoadState('networkidle')  // Wait for network to settle
2. await this.page.waitForTimeout(1000-2000)         // Extra time for JS rendering
3. await locator.waitFor({ state: 'visible' })       // Wait for specific element

## What was implemented
- Full automation of the provided scenario using the exact baseline framework.
- New POM classes: `RegistrationPage`, `MailCatcherPage` (plus one helper method on existing `LoginPage`).
- New test: `tests/negotiator-registration.test.ts`.
- Firefox maximized launch support (viewport: null – only for Firefox).
- Avatar upload, unique email per run, basic-auth Mailcatcher handling, full logging + test steps.

## Why this way / Patterns & approaches used
- **POM**: Actions encapsulated in page classes; locators centralized and resilient (role/text-based per Playwright best practices).
- **Separation of concerns**: All verifications/assertions live in the test file.
- **Logging & traceability**: Every major step logged via existing Winston logger + `test.step`.
- **Stability**: `waitForURL`, `toHaveURL`, auto-waiting locators, unique test data.
- **Config-driven**: Uses existing `config.baseURL`; no hard-coded URLs except the exact Mailcatcher auth requirement.
- **Firefox fix**: Only modified Firefox project in `playwright.config.ts` – zero changes to Chromium/Edge as required.

## Assumptions / Considerations / Known limitations
- **QA Environment Stability**: Tests assume `qa6.negsim.com` is available and responsive at all times
- **Email Delivery**: Assumes emails are delivered to Mailcatcher within reasonable time (~15 seconds)
- **Basic Auth Credentials**: Mailcatcher credentials are static (`developer` / `MDEzODcyNjY5NjEx`)
- **Avatar File**: Assumes `data/avatar.png` exists in the project (any image format works)
- **Form Fields**: Email input is `[type="email"]`, password is `[type="password"]`, standard field labels (First/Last Name, Email, Password)
- **Mailcatcher HTML Structure**: Email body is rendered inside an iframe with `class="body"` attribute
- **Parallel-Safe**: All tests can run in parallel without data collisions (unique email per run)

### ⚠️ Known Limitations & Mitigations

#### **Mailcatcher Iframe Selector**
- **Issue**: Email body content is rendered inside an iframe
- **Current Solution**: Uses `iframe[class="body"]` as primary selector
- **Fallback Strategies**: 
  - Secondary: `iframe[src*="messages"]` (matches iframe by src pattern)
  - Tertiary: `iframe` (any iframe on page)
- **If Structure Changes**: Update iframe selector in `MailCatcherPage.findAndClickCompleteRegistrationLink()` method
- **Code Reference**: Lines 24-55 in `pages/mail-catcher-page.ts`

#### **Network Dependency**
- **Issue**: Test waits for email to arrive in Mailcatcher; network delays can cause timeouts
- **Current Timeout**: 15 seconds for element visibility
- **Mitigation**: Configurable timeout in `findAndClickCompleteRegistrationLink()` method
- **Recommendation**: Increase timeout if testing on slower networks
```typescript
await activationLink.waitFor({ state: 'visible', timeout: 20000 });

Run example:
`npx playwright test --project=chromium --reporter=html -g "Negotiator Account Registration"`
