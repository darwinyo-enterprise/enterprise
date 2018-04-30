import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { BaseTestPage } from '@enterprise/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';
import { FileUploadMocks } from '@enterprise/material/file-upload';

export class FileUploadPage extends BaseTestPage<FileUploadComponent> {
  constructor(public fixture: ComponentFixture<FileUploadComponent>) {
    super(fixture);
  }
  get fileInput() {
    return this.query<HTMLInputElement>('input[type=file]');
  }
  get uploadBtn() {
    return this.query<HTMLButtonElement>('button#upload-btn');
  }
  get dropdownZone() {
    return this.query<HTMLElement>('.file-upload__drop-zone');
  }
}
describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let fileUploadPage: FileUploadPage;
  let mockFileUpload: UploadFileModel[];
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        declarations: [FileUploadComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    mockFileUpload = FileUploadMocks;
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;

    fileUploadPage = new FileUploadPage(fixture);

    component.filesImage = mockFileUpload;
    fixture.detectChanges();
  });
  describe('Functionality Test', () => {
    it('should have accept multiple attribute when multiple is true', () => {
      component.multiple = true;
      component.checkMultipleFileValidation();
      fixture.detectChanges();

      expect(fileUploadPage.fileInput.hasAttribute('multiple')).toBeTruthy();
    });
    it('should not have multiple attribute when multiple is false', () => {
      component.multiple = false;
      component.disable = false;
      fixture.detectChanges();

      expect(fileUploadPage.fileInput.hasAttribute('multiple')).toBeFalsy();
    });
    it('should disable if multiple image exists in single', () => {
      component.multiple = false;
      component.disable = false;
      fixture.detectChanges();
      let input = fileUploadPage.dropdownZone.textContent;

      component.checkMultipleFileValidation();
      fixture.detectChanges();

      expect(fileUploadPage.dropdownZone.textContent).not.toContain(input);
    });
    it('should enable if all images deleted in single mode', () => {
      component.multiple = false;
      component.disable = false;
      fixture.detectChanges();
      let input = fileUploadPage.dropdownZone.textContent;

      component.checkMultipleFileValidation();
      fixture.detectChanges();

      expect(fileUploadPage.dropdownZone.textContent).not.toContain(input);

      component.filesImage = [];
      component.checkMultipleFileValidation();
      fixture.detectChanges();
      expect(fileUploadPage.dropdownZone.textContent).toContain(input);
    });
  });
});
