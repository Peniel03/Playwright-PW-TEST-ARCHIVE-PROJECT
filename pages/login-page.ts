import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private emailInput = () => this.page.locator('input[name="email"]');
  private passwordInput = () => this.page.locator('input[type="password"]');
  private loginButton = () => this.page.locator('button[data-automation="login-button-layout-login"]');
  private errorMessage = () => this.page.locator('div.error span');

  async login(user: User): Promise<void> {
    logger.info(`✏️  Specify email: ${user.username}`);
    await this.emailInput().fill(user.username);
    logger.info("✏️  Specify password: *****");
    await this.passwordInput().fill(user.password);
    logger.info("🖱️  Click login button");
    await this.loginButton().click();
    logger.info("⏳ Wait for successful login");
    await this.page.waitForURL('**/the-negotiation-experts/classes');
  }
}