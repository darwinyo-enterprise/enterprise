import { ProductPage } from "./product.po";
import { browser, Key, protractor } from "protractor";

describe('Product Scenario', () => {
    let page: ProductPage
    let path = require('path');

    beforeEach(() => {
        page = new ProductPage();
    })
    fdescribe('display list product scenario', () => {
        beforeEach(async () => {
            await page.navigateToList();
            await browser.sleep(1000);
        })
        //#region no data persists
        it('should navigate to add product when add button clicked', async () => {
            await browser.executeScript('window.scrollTo(0,0);');
            await browser.sleep(1000);
            await page.listItemBtnAdd().click();

            expect(await browser.getCurrentUrl()).toBe('http://localhost:4200/product/add');
        })
        it('should navigate edit product when edit button clicked', async () => {
            await browser.executeScript('window.scrollTo(0,0);');
            await browser.sleep(1000);
            await page.lastEditBtn().click();
            await browser.sleep(1000);
            expect(await browser.getCurrentUrl()).toContain('http://localhost:4200/product/edit');
        })
        it('should display list of products', async () => {
            expect(await page.listItemActions().count()).toBeGreaterThan(1);
        })
        it('should pop up prompt when delete button clicked', async () => {
            await browser.executeScript('window.scrollTo(0,0);');
            await browser.sleep(1000);
            await page.lastDeleteBtn().click();
            await browser.sleep(1000);
            expect(await page.prompt()).toBeTruthy();
        })
        it('should not delete product when prompt cancel is clicked', async () => {
            await browser.executeScript('window.scrollTo(0,0);');
            await page.lastPaginationBtn().click();
            await browser.sleep(2000);
            let lst = await page.listItemActions().count();
            await browser.sleep(1000);

            await page.lastDeleteBtn().click();
            await browser.sleep(1000);

            await page.promptCancelButton().click();
            await browser.sleep(1000);

            expect(await page.listItemActions().count()).toBe(lst);

        })
        //#endregion

        it('should add product when add button clicked', async () => {
            let testName = 'zzz';
            await page.lastPaginationBtn().click();

            await browser.sleep(2000);
            //#region Verify
            const verifyItem = await page.listItemActions().last().getText();
            // test item already there
            if (verifyItem.includes(testName)) {
                await browser.sleep(1000);
                //clean up
                await page.lastDeleteBtn().click();
                await browser.sleep(1000);

                await page.promptCancelButton().click();
                await browser.sleep(1000);
            }
            //#endregion
            expect(await page.listItemActions().last().getText()).not.toContain(testName);
            await browser.sleep(1000);
            await page.listItemBtnAdd().click();
            await browser.sleep(1000);
            await page.formNameTxtbox().sendKeys(testName);
            await page.formPriceTxtbox().sendKeys(1000);
            await page.formDescriptionTxtbox().sendKeys('test Description');
            await page.formCategorySelect().click();

            await browser.sleep(1000);
            await page.matOption().first().click();

            await page.formManufacturerSelect().click();

            await browser.sleep(1000);
            await page.matOption().first().click();

            await page.formColorChipTxtbox().sendKeys('Yellow', protractor.Key.ENTER);
            await browser.sleep(1000);
            await page.formColorChipTxtbox().sendKeys('Red', protractor.Key.ENTER);
            await browser.sleep(1000);

            await page.fileUploadDropZone().sendKeys(path.resolve(__dirname, '../assets/test-product.png'));

            await browser.sleep(10000);
            await page.formSubmitBtn().click();
            await browser.sleep(1000);

            await page.popupCloseButton().click();
            await browser.sleep(1000);
            await page.lastPaginationBtn().click();
            await browser.sleep(2000);
            let element = await page.listItemActions().last().getText();
            expect(element).toContain(testName);
        })

        fit('should change product when form edit submitted', async () => {
            await browser.executeScript('window.scrollTo(0,0);');
            let testName = 'zzz1';
            await page.lastPaginationBtn().click();
            await browser.sleep(2000);

            //#region Verify
            const verifyItem = await page.listItemActions().last().getText();
            // test item already there
            if (verifyItem.includes(testName)) {
                await browser.sleep(1000);
                //clean up
                await page.lastDeleteBtn().click();
                await browser.sleep(1000);

                await page.promptCancelButton().click();
                await browser.sleep(1000);
            }
            //#endregion

            expect(await page.listItemActions().last().getText()).not.toContain(testName);
            await browser.sleep(1000);
            await page.lastEditBtn().click();
            await browser.sleep(1000);
            await page.formNameTxtbox().clear();
            await page.formNameTxtbox().sendKeys(testName);
            await page.formSubmitBtn().click();
            await browser.sleep(1000);
            await page.popupCloseButton().click();
            await browser.sleep(2000);
            await page.lastPaginationBtn().click();
            await browser.sleep(2000);
            let element = await page.listItemActions().last().getText();
            expect(element).toContain(testName);
        })

        it('should delete product when prompt ok is clicked', async () => {
            await browser.executeScript('window.scrollTo(0,0);');
            await page.lastPaginationBtn().click();
            await browser.sleep(2000);
            let targetDelete = page.listItemNames().last().getText();

            await browser.sleep(1000);
            await page.lastDeleteBtn().click();
            await browser.sleep(1000);
            await page.promptOkButton().click();
            await browser.sleep(2000);

            await page.popupCloseButton().click();
            await browser.sleep(1000);
            await page.lastPaginationBtn().click();
            await browser.sleep(2000);
            expect(await page.listItemNames().filter(x => x.getText() === targetDelete).count()).toBe(0);
        })
    })
})