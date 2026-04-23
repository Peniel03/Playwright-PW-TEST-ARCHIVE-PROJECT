import { BasePage } from "./base-page";
import {logger} from "../utils/logger";
import * as path from "path";

export class RegistrationPage extends BasePage {
    private readonly firstNameInput = () => this.page.getByRole('textbox', { name: /first name/i });
    private readonly lastNameInput = () => this.page.getByRole('textbox', { name: /last name/i });
    private readonly emailInput = () => this.page.getByRole('textbox', { name: /email/i });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    
    private readonly avatarInput = () => 
    this.page.locator('input[type="file"]')
      .or(this.page.getByLabel(/avatar|photo|image/i))
      .or(this.page.locator('[data-automation*="avatar"], [data-testid*="avatar"]'));
    
    private readonly saveButton = () => this.page.getByRole('button', { name: /save/i }) ;

async fillRegistrationForm(firstName: string, lastName: string, email: string, password:string) {
    logger.info(`✏️  Filling registration form for ${email}`);
    await this.firstNameInput().fill(firstName);
    await this.lastNameInput().fill(lastName);
    await this.emailInput().fill(email);

    logger.info('Focusing and filling Password field...');
    const passwordField = this.page.locator('input[data-automation="password-input-shared"]')
      .or(this.page.getByPlaceholder('Enter Password'));    
    
    await passwordField.focus(); 
    await passwordField.fill(password);

    logger.info('Password strength may be blocking confirm field. Using keyboard to move to next field...');
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(800);
    await this.page.keyboard.type(password);
    
    logger.info('Filled password and attempted confirm password via keyboard');
    await this.page.waitForTimeout(1500);
    logger.info('All required fields filled successfully');
}

async uploadAvatar(){
    const avatarPath = path.join(__dirname, '../data/avatar.png');
    logger.info(`📁 Uploading avatar: ${avatarPath}`);
   
    const fileInput = this.avatarInput();
    await fileInput.waitFor({ state: 'attached', timeout: 15000 });
    if (await fileInput.isHidden()) {
      logger.info('Avatar input is hidden - making it visible with force');
      await fileInput.evaluate((el: HTMLInputElement) => { el.style.display = 'block'; });
    }

    await fileInput.setInputFiles(avatarPath);    
    logger.info('Avatar uploaded successfully');
}


async clickSave() {
    logger.info('🖱️  Clicking save button');
    await this.saveButton().click();
}

async isOnEmailConfirmationPage(): Promise<boolean> {
    return this.page.url().includes('/account/confirm/email');
}

}
