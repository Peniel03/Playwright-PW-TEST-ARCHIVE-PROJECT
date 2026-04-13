import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export class BasePage {
  constructor(public page: Page) {}

  async navigate(url: string) {
    logger.info(`⏩ Navigating to ${url}`);
    await this.page.goto(url);
  }

  async isOnClassesPage(): Promise<boolean> {
    return this.page.url().includes('/the-negotiation-experts/classes');
  }

  async isOnLeaderboardPage(): Promise<boolean> {
    return this.page.url().includes('/the-negotiation-experts/leaderboard');
  }
}