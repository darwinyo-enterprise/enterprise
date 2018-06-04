import { browser, by, element, WebElement, $, $$ } from 'protractor';

export class ManufacturerPage {
    navigateToList() {
        return browser.get('/manufacturer/list');
    }
    navigateToAdd() {
        return browser.get('/manufacturer/add');
    }
    navigateToEdit(id: number) {
        return browser.get('/manufacturer/edit/' + id);
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
    formSubmitBtn() {
        return $('#save-button');
    }
}
