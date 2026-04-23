# Playwright-PW-TEST-ARCHIVE-PROJECT

# Playwright Automation Task – Negotiator Registration

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
- Registration form field labels assumed standard (First/Last Name, Email, Password). If exact labels differ, update the getters in `RegistrationPage` (one-line change).
- Email confirmation & success message texts use partial matches + exact URL checks (robust). Exact text can be refined from the page images provided in the task.
- Avatar file must exist in `data/avatar.png` (any image works).
- Mailcatcher link text uses partial match – works for typical activation emails.
- No CI/headless changes needed; runs perfectly in headed mode as per framework.
- All tests remain parallel-safe.

Run example:
`npx playwright test --project=chromium --reporter=html -g "Negotiator Account Registration"`