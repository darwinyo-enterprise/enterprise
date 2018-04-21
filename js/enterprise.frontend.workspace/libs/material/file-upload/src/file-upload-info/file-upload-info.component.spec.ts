import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadInfoComponent } from './file-upload-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('[LIBRARY] FileUploadInfoComponent', () => {
  let component: FileUploadInfoComponent;
  let fixture: ComponentFixture<FileUploadInfoComponent>;
  let fileUploadInfoElement:HTMLElement=fixture.nativeElement;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FileUploadInfoComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI Test', () => {
    it('should add img src properly', () => {
      // Make sure img isn't exist yet
      let imageElements= fileUploadInfoElement.querySelectorAll('img');
      expect(imageElements.length).toBe(0);

      component.filesUpload.push()
      // Act

      // Assert
    });
  });
  describe('Functionality Test', () => {
    it('');
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
