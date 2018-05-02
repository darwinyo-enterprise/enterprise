import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerFormComponent } from './manufacturer-form.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import { ManufacturerState } from '@enterprise/commerce';
import { ManufacturerService } from '@enterprise/commerce/catalog-lib';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

export class ManufacturerFormPage extends BaseTestPage<
  ManufacturerFormComponent
> {
  constructor(public fixture: ComponentFixture<ManufacturerFormComponent>) {
    super(fixture);
  }
  get saveBtn() {
    return this.query<HTMLButtonElement>('#save-button');
  }
  get nameInputControl() {
    return this.query<HTMLInputElement>('#name');
  }
  get descriptionInputControl() {
    return this.query<HTMLElement>('#description');
  }
  get title() {
    return this.query<HTMLElement>('.form-card__title');
  }
}

fdescribe('ManufacturerFormComponent', () => {
  let component: ManufacturerFormComponent;
  let fixture: ComponentFixture<ManufacturerFormComponent>;
  let manufacturerFormPage: ManufacturerFormPage;
  let store: Store;
  const title = 'Test Manufacturer';
  const btnName = 'Add';
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          NgxsModule.forRoot([FileUploadState, ManufacturerState])
        ],
        declarations: [ManufacturerFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [ManufacturerService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerFormComponent);
    component = fixture.componentInstance;
    component.nameSaveButton = btnName;
    component.title = title;

    manufacturerFormPage = new ManufacturerFormPage(fixture);
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  describe('Functionality Tests', () => {
    // it('should populate value in input when manufacturer input provided', () => {});
    // it('should populate value to form when file upload changed', () => {});
    // it('should remove form value when image deleted', () => {});
  });

  describe('UI Tests', () => {
    it('should render correct Title', () => {
      expect(manufacturerFormPage.title).toEqual('Test Manufacturer');
    });
    // it('should render correct save button name', () => {
    //   expect(manufacturerFormPage.saveBtn).toContain(btnName);
    // });
    // it('should disabled save button when form pristine', () => {
    //   expect(
    //     manufacturerFormPage.saveBtn.attributes.getNamedItem('disabled')
    //       .textContent
    //   ).toBeTruthy();
    // });
    // it('should disabled save button when form invalid', () => {
    //   // Name Field Null => invalid
    //   expect(
    //     manufacturerFormPage.saveBtn.attributes.getNamedItem('disabled')
    //       .textContent
    //   ).toBeTruthy();

    //   // Name Field Inputed
    //   manufacturerFormPage.nameInputControl.value = 'Tests';

    //   fixture.detectChanges();

    //   expect(
    //     manufacturerFormPage.saveBtn.attributes.getNamedItem('disabled')
    //       .textContent
    //   ).toBeUndefined();
    // });
    // it('should render validation error message when input error', () => {});
    // it('should enabled save button when form valid', () => {});
  });
});
