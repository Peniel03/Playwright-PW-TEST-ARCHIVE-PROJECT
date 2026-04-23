import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { RegistrationPage } from '../pages/registration-page';
import { MailCatcherPage } from '../pages/mail-catcher-page';
import { config } from '../configs/config';
import { logger } from '../utils/logger';

test.describe('Negotiator Account Registration', () => {
  let testEmail: string;

  test.beforeEach(async () => {
    testEmail = `test.negotiator.${Date.now()}@example.com`;
    logger.info(`=== Starting registration test with email: ${testEmail} ===`);
  });

  test('should register new negotiator, confirm email via Mailcatcher, and activate account', async ({ page, context }) => {
    test.setTimeout(60000);
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);

    await test.step('1. Open login page', async () => {
       logger.info('Navigating to login page...');
      await page.goto(`${config.baseURL}/user/login`, {
        waitUntil: 'domcontentloaded', 
        timeout: 45000
      });

      await page.getByRole('button', { name: /login/i }).waitFor({ state: 'visible', timeout: 15000 });
      logger.info('Login page opened successfully');
    });

    await test.step('2. Click "Create a Negotiator account"', async () => {
      await loginPage.clickCreateNegotiatorAccount();
    });

    await test.step('3-4. Fill required fields and upload avatar', async () => {
      await registrationPage.fillRegistrationForm('Test', 'Negotiator', testEmail, 'TestPass123!');
      await page.waitForTimeout(2000);
      await registrationPage.uploadAvatar();
    });

    await test.step('5. Hit Save', async () => {
      await registrationPage.clickSave();
    });

    await test.step('6. Verify navigation to email confirmation page + message', async () => {
      await expect(page).toHaveURL(/account\/confirm\/email/, { timeout: 15000 });
      await expect(page.getByText('A confirmation email has been sent to')).toBeVisible({ timeout: 10000 });
      logger.info('Successfully reached email confirmation page');
    });

    await test.step('7. Open Mailcatcher and complete registration', async () => {
        logger.info('Opening Mailcatcher with basic authentication');

        const browser = context.browser();
      if (!browser) {
        throw new Error('Browser instance is not available');
      }

      const mailContext = await browser.newContext({
        httpCredentials: {
          username: 'developer',
          password: 'MDEzODcyNjY5NjEx',
        },
      });
      
      const mailPage = await mailContext.newPage();
      const mailCatcher = new MailCatcherPage(mailPage);

      await mailPage.goto('https://qa6.negsim.com/mailcatcher', { timeout: 30000 });
      const activationUrl = await mailCatcher.findAndClickCompleteRegistrationLink(testEmail);
      //await mailCatcher.findAndClickCompleteRegistrationLink(testEmail);

      await mailPage.close();
      await mailContext.close();

      logger.info(`Found activation URL, navigating main page to it`);

      await page.goto(activationUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      logger.info('Mailcatcher step completed');
    });

    await test.step('8. Verify navigation to profile page + success message', async () => {
      await expect(page).toHaveURL(/account\/profile/, { timeout: 20000 });
      await expect(page.getByText('You’ve successfully activated your account')).toBeVisible({ timeout: 10000 });
      logger.info('Account successfully activated – test passed');
    });
  });
});