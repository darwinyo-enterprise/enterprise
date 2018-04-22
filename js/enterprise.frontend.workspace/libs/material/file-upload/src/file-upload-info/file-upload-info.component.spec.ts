import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTestPage } from '@enterprise/core/testing';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';

import { FileUploadInfoComponent } from './file-upload-info.component';
import { FileUploadMocks } from '../mocks/file-upload.mocks';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class FileUploadInfoPage extends BaseTestPage<FileUploadInfoComponent> {
  constructor(public fixture: ComponentFixture<FileUploadInfoComponent>) {
    super(fixture);
  }

  get fileImages() {
    return this.queryAll<HTMLElement>('.file-upload-info__card__img > img');
  }
  get deleteBtns() {
    return this.queryAll<HTMLElement>('.file-upload-info__card__delete-btn');
  }
}

describe('FileUploadInfoComponent', () => {
  let component: FileUploadInfoComponent;
  let fixture: ComponentFixture<FileUploadInfoComponent>;
  let fileUploadInfoPage: FileUploadInfoPage;
  let mockFileUpload: UploadFileModel[];
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FileUploadInfoComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    mockFileUpload = FileUploadMocks;

    fixture = TestBed.createComponent(FileUploadInfoComponent);
    component = fixture.componentInstance;
    fileUploadInfoPage = new FileUploadInfoPage(fixture);

    // 1st change detection triggers ngOnInit
    fixture.detectChanges();
  });

  describe('Test UI', () => {
    it('should display correctly img url', () => {
      component.filesUpload = mockFileUpload;
      // 2nd change detection
      fixture.detectChanges();

      expect(
        fileUploadInfoPage.fileImages[0].attributes.getNamedItem('src')
          .textContent
      ).toContain(mockFileUpload[0].fileUrl);
      expect(
        fileUploadInfoPage.fileImages[1].attributes.getNamedItem('src')
          .textContent
      ).toContain(mockFileUpload[1].fileUrl);
      expect(
        fileUploadInfoPage.fileImages[2].attributes.getNamedItem('src')
          .textContent
      ).toContain(mockFileUpload[2].fileUrl);
      expect(
        fileUploadInfoPage.fileImages[3].attributes.getNamedItem('src')
          .textContent
      ).toContain(mockFileUpload[3].fileUrl);
    });

    it('should not display anything', () => {
      expect(fileUploadInfoPage.fileImages.length).toBe(0);
    });
  });

  describe('Functional Test', () => {
    it('should emit delete event when delete button clicked', () => {
      component.filesUpload = mockFileUpload;
      // 2nd change detection
      fixture.detectChanges();

      // Subscribe Event Emitter
      let value: UploadFileModel;
      component.deleteFile.subscribe((val: UploadFileModel) => (value = val));

      fileUploadInfoPage.deleteBtns[0].click();

      expect(value.id).toBe(mockFileUpload[0].id);
      expect(value.fileName).toBe(mockFileUpload[0].fileName);
    });
  });
});
