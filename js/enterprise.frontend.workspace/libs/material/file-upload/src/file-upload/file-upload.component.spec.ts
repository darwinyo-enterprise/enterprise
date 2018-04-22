import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { BaseTestPage } from '@enterprise/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class FileUploadPage extends BaseTestPage<FileUploadComponent> {
  constructor(public fixture: ComponentFixture<FileUploadComponent>) {
    super(fixture);
  }
  get fileInput(){
    return this.query<HTMLInputElement>('input[type=file]');
  }
}
describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

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
    fixture.detectChanges();
  });
  describe('UI Test', () => {});
  fdescribe('Functionality Test', () => {
    it('should have accept multiple attribute when multiple is true', () => {
      component.multiple = true;
      fixture.detectChanges();
      console.log(component.File);
      expect(component.File.multiple).toBeTruthy();
    });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
