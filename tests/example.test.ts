import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { config } from '../configs/config';
import { logger } from '../utils/logger';

test.describe.parallel('Login Tests', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate(config.baseURL);
    });

    test('Open Login Portal', async ({ page }) => { 
        await test.step('Start test', async () => {
            logger.info('ℹ️  Starting test');
        });

        await test.step('Open Login Portal', async () => {
            const loginPage = new LoginPage(page);
        });
    });
});