import {BasePage} from './base-page';
import {logger} from "../utils/logger";

export class MailCatcherPage extends BasePage {
async findAndClickCompleteRegistrationLink(email: string): Promise<string> {
    logger.info(`🔍 Searching for registration email sent to ${email}`);

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const emailRow = this.page.locator(`tr:has-text("${email}")`).first();
    await emailRow.waitFor({ state: 'visible', timeout: 30000 });
    logger.info('📧 Found email row in mailcatcher');
    await emailRow.click();

    logger.info('📧 Clicked email row');

    const activationLink = this.page.getByRole('link', { name: /complete registration|activate|confirm/i }).first() ;

    const href = await activationLink.getAttribute('href');
    if (!href) throw new Error(`Activation link not found for ${email}`);

    logger.info(`Found activation URL: ${href}`);
    return href.startsWith('http') ? href : `https://qa6.negsim.com${href}`;

}
}