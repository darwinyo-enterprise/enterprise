import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { BaseTestPage } from '@enterprise/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class FileUploadPage extends BaseTestPage<FileUploadComponent> {
  constructor(public fixture: ComponentFixture<FileUploadComponent>) {
    super(fixture);
  }
  get fileInput() {
    return this.query<HTMLInputElement>('input[type=file]');
  }
  
}
describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let fileUploadPage: FileUploadPage;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FileUploadComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fileUploadPage = new FileUploadPage(fixture);

    fixture.detectChanges();
  });
  describe('UI Test', () => {
    it()
  });
  describe('Functionality Test', () => {
    it('should have accept multiple attribute when multiple is true', () => {
      component.multiple = true;
      fixture.detectChanges();

      expect(fileUploadPage.fileInput.hasAttribute('multiple')).toBeTruthy();
    });
    it('should not have multiple attribute when multiple is false', () => {
      component.multiple = false;
      fixture.detectChanges();

      expect(fileUploadPage.fileInput.hasAttribute('multiple')).toBeFalsy();
    });

    it('should accept file type by defining accept Input', () => {
      component.accept = '.jpg';
      fixture.detectChanges();

      expect(fileUploadPage.fileInput.getAttribute('accept')).toBe(
        component.accept
      );
    });
  });
});
