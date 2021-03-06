import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerFormComponent } from './manufacturer-form.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState, AddFileImage, FileUploadMocks, DeleteFileImage, UploadFileModel } from '@enterprise/material/file-upload';
import { ManufacturerState } from '../shared/manufacturer.state';
import { ManufacturerService } from '@enterprise/commerce/catalog-lib';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ManufacturersMock } from '../mocks/manufacturer-service.mock';
import { FetchSingleManufacturer } from '../shared/manufacturer.actions';

export class ManufacturerFormPage extends BaseTestPage<
  ManufacturerFormComponent
  > {
  constructor(public fixture: ComponentFixture<ManufacturerFormComponent>) {
    super(fixture);
  }
  get saveBtn() {
    return this.query<HTMLButtonElement>('#save-button');
  }
  get nameInputGroup() {
    return this.query<HTMLElement>('#name-txtbox');
  }
  get nameInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.nameInputGroup.children.item(0);
  }
  get descriptionInputControl() {
    return this.query<HTMLElement>('#description');
  }
  get title() {
    return this.query<HTMLElement>('.form-card__title');
  }
}

describe('ManufacturerFormComponent', () => {
  let component: ManufacturerFormComponent;
  let fixture: ComponentFixture<ManufacturerFormComponent>;
  let manufacturerFormPage: ManufacturerFormPage;
  let store: Store;
  let service: ManufacturerService;
  let serviceSpy: jasmine.Spy;
  const title = 'Test Manufacturer';
  const btnName = 'Add';
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [ManufacturerService],
        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          NgxsModule.forRoot([FileUploadState, ManufacturerState])
        ],
        declarations: [ManufacturerFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerFormComponent);
    component = fixture.componentInstance;
    component.nameSaveButton = btnName;
    component.title = title;

    manufacturerFormPage = new ManufacturerFormPage(fixture);
    service = TestBed.get(ManufacturerService);
    serviceSpy = spyOn(service, 'apiV1ManufacturerByIdGet').and.callFake((id: number) => of(ManufacturersMock.filter(x => x.id === id)[0]));

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  describe('Functionality Tests', () => {

    it('should populate value to image url in form when file upload changed', () => {
      const uploadFileModel: UploadFileModel = FileUploadMocks[0];
      expect(
        component.manufacturerForm.controls['imageUrl'].value
      ).not.toContain(uploadFileModel.fileUrl);
      expect(
        component.manufacturerForm.controls['imageName'].value
      ).not.toContain(uploadFileModel.fileName);

      store.dispatch(new AddFileImage(uploadFileModel));

      expect(component.manufacturerForm.controls['imageUrl'].value).toContain(
        uploadFileModel.fileUrl
      );
      expect(component.manufacturerForm.controls['imageName'].value).toContain(
        uploadFileModel.fileName
      );
    });
    it('should remove image url in form value when image deleted', () => {
      const uploadFileModel: UploadFileModel = FileUploadMocks[0];
      store.dispatch(new AddFileImage(uploadFileModel));

      expect(component.manufacturerForm.controls['imageUrl'].value).toContain(
        uploadFileModel.fileUrl
      );
      expect(component.manufacturerForm.controls['imageName'].value).toContain(
        uploadFileModel.fileName
      );

      store.dispatch(new DeleteFileImage(uploadFileModel.fileName));

      expect(
        component.manufacturerForm.controls['imageUrl'].value
      ).not.toContain(uploadFileModel.fileUrl);
      expect(
        component.manufacturerForm.controls['imageName'].value
      ).not.toContain(uploadFileModel.fileName);
    });
  });

  describe('UI Tests', () => {
    it('should render correct Title', () => {
      expect(manufacturerFormPage.title.innerText).toContain(title);
    });
    it('should render correct save button name', () => {
      expect(manufacturerFormPage.saveBtn.innerText).toContain(btnName);
    });
    it('should disabled save button when form pristine', () => {
      expect(
        manufacturerFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
    });
    it('should disabled save button when form invalid', () => {
      // Name Field Null => invalid
      expect(
        manufacturerFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
      component.manufacturerForm.markAsTouched();
      component.manufacturerForm.markAsDirty();

      fixture.detectChanges();
      expect(
        manufacturerFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
    });
    it('should render validation error message when input error', () => {
      component.manufacturerForm.patchValue({
        name: 'Test'
      });
      component.nameControl.markAsDirty();
      component.nameControl.markAsTouched();
      fixture.detectChanges();
      expect(manufacturerFormPage.nameInputGroup.children.length).toEqual(1);

      component.manufacturerForm.patchValue({
        name: ''
      });

      fixture.detectChanges();
      expect(manufacturerFormPage.nameInputGroup.children.length).toEqual(2);
      expect(
        manufacturerFormPage.nameInputGroup.children.item(1)
      ).toBeDefined();
    });
    it('should not render validation error message when input is pristine', () => {
      expect(component.nameControl.pristine).toBeTruthy();
      expect(component.nameControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(manufacturerFormPage.nameInputGroup.children.length).toEqual(1);
      expect(manufacturerFormPage.nameInputGroup.children.item(1)).toBeNull();
    });
    it('should enabled save button when form valid', () => {
      // Name Field Null => invalid
      expect(
        manufacturerFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();

      // Name Field Inputed
      component.manufacturerForm.patchValue({
        name: 'Test'
      });

      fixture.detectChanges();
      expect(manufacturerFormPage.saveBtn.hasAttribute('disabled')).toBeFalsy();
    });
  });
  describe('State Tests', () => {
    it('should populate value in input when selected manufacturer state exists', () => {
      store.dispatch(new FetchSingleManufacturer(ManufacturersMock[0].id.toString()));
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.manufacturerForm.value).toEqual(ManufacturersMock[0]);
    });
  })
});
