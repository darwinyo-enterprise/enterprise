import { browser, by, element } from 'protractor';

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
    title() {
        return browser.findElement(by.css('.form-card__title')).getText();
    }
    listItemActions() {
        return browser.findElements(by.css('.list-item-actions__item'));
    }
    listItemBtnAdd() {
        return browser.findElement(by.css('.li-addBtn')).getInnerHtml();
    }
    fileUploadDropZone() {
        return browser.findElement(by.css('.file-upload__drop-zone')).getInnerHtml();
    }
    fileUploadDropZoneBtn(){
        return browser.findElement(by.css('.file-upload__drop-zone__button')).getInnerHtml();
    }
    fileUploadInfoCards(){
        return browser.findElements(by.css('.file-upload-info__card'));
    }
    formNameTxtbox(){
        return browser.findElement(by.css('#name-txtbox')).getInnerHtml();
    }
    formDescriptionTxtbox(){
        return browser.findElement(by.css('#description')).getInnerHtml();
    }
    formSubmitBtn(){
        return browser.findElement(by.css('#save-button')).getInnerHtml();
    }
}
