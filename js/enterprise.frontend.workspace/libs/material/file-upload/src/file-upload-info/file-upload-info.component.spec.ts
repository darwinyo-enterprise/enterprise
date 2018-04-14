import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadInfoComponent } from './file-upload-info.component';

describe('FileUploadInfoComponent', () => {
  let component: FileUploadInfoComponent;
  let fixture: ComponentFixture<FileUploadInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
