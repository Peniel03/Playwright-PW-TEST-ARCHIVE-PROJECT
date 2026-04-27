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

    logger.info('📧 Clicked email row , waiting for email details to load');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(2000);

    const emailBodyFrame = this.page.frameLocator('iframe[class="body"]');
    let activationLink = this.page.locator('a:has-text("complete registration")').first();

    try {
        await activationLink.waitFor({ state: 'visible', timeout: 5000 });
        logger.info('📧 Activation link found in iframe using text selector');
    } catch {
        logger.info('Link not found with text selector, trying alternative iframe selectors...');
        
        const altFrame = this.page.frameLocator('iframe[src*="messages"]');
        activationLink = altFrame.locator('a:has-text("complete registration")').first();
         try {
            await activationLink.waitFor({ state: 'visible', timeout: 5000 });
            logger.info('📧 Activation link found in alternative iframe');
        } catch {
            logger.info('Trying any iframe on the page...');
            const anyFrame = this.page.frameLocator('iframe').first();
            activationLink = anyFrame.locator('a:has-text("complete registration")').first();
            await activationLink.waitFor({ state: 'visible', timeout: 10000 });
            logger.info('📧 Activation link found in first iframe');
        }
    }

    const href = await activationLink.getAttribute('href');
    if (!href) throw new Error(`Activation link not found for ${email}`);

    logger.info(`Found activation URL: ${href}`);
    return href.startsWith('http') ? href : `https://qa6.negsim.com${href}`;

}
}