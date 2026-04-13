import { Page, expect } from '@playwright/test';
import { BasePage } from '../pages/base-page';
import { logger } from '../utils/logger';
import { config } from '../configs/config';

export class SimHeaderPanel extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private userName = () => this.page.locator('div.user-name');
  private userRole = () => this.page.locator('div.user-role');

  async VerifyUserNameRole(): Promise<void> {
    logger.info('✔️  Verifying user name visibility...');
    await expect(this.userName()).toBeVisible({ timeout: config.defaultTimeout });

    logger.info('✔️  Verifying user role visibility...');
    await expect(this.userRole()).toBeVisible({ timeout: config.defaultTimeout });

    logger.info('✅ User name and role are visible');
  }
}