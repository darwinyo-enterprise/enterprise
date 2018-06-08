import { browser, by, element, WebElement, $, $$ } from 'protractor';

export class ProductPage {
    navigateToList() {
        return browser.get('/product/list');
    }
    navigateToAdd() {
        return browser.get('/product/add');
    }
    navigateToEdit(id: number) {
        return browser.get('/product/edit/' + id);
    }

    prompt() {
        return $('mat-dialog-container');
    }
    promptOkButton() {
        return $('mat-dialog-container button.mat-button.mat-accent');
    }
    promptCancelButton() {
        return $('mat-dialog-container button.mat-button');
    }

    popupCloseButton() {
        return $('mat-dialog-container button')
    }

    listItemNames() {
        return $$('.list-item-actions__item__name');
    }
    listItemActions() {
        return $$('.list-item-actions__item');
    }
    lastListItemAction() {
        return this.listItemActions().last();
    }
    lastDeleteBtn() {
        return this.lastListItemAction().element(by.css('.list-item-actions__item__delete > button'));
    }
    lastEditBtn() {
        return this.lastListItemAction().element(by.css('.list-item-actions__item__edit > button'));
    }
    listItemBtnAdd() {
        return $('#li-addBtn');
    }

    lastPaginationBtn() {
        return $('.td-paging-bar-last-page');
    }

    fileUploadDropZone() {
        return $('.file-upload__drop-zone input[type=file]');
    }

    formNameTxtbox() {
        return $('#name-txtbox input');
    }
    formDescriptionTxtbox() {
        return $('#description textarea');
    }
    formPriceTxtbox() {
        return $('#price-txtbox input')
    }
    formCategorySelect() {
        return $('#category-select mat-select')
    }
    formManufacturerSelect() {
        return $('#manufacturer-select mat-select')
    }
    formStockTxtbox() {
        return $('#stock-txtbox input');
    }
    formDiscountTxtbox() {
        return $('#discount-txtbox input');
    }
    formLocationTxtbox() {
        return $('#location-txtbox input');
    }
    formMinPurchaseTxtbox() {
        return $('#min-purchase-txtbox input');
    }
    formHasExpiry() {
        return $('#has-expire-checkbox');
    }
    formExpireDateTxtbox() {
        return $('#expire-date-calender input');
    }
    matOption() {
        return $$('mat-option');
    }
    formColorChipTxtbox() {
        return $('td-chips input');
    }
    formSubmitBtn() {
        return $('#save-button');
    }
}
