import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFormComponent } from './category-form.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState, AddFileImage, FileUploadMocks, DeleteFileImage } from '@enterprise/material/file-upload';
import { CategoryService, UploadFileModel } from '@enterprise/commerce/catalog-lib';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CategoryState } from '../shared/category.state';
import { CategoriesMock } from '../mocks/category-service.mock';
import { FetchSingleCategory } from '../shared/category.actions';

export class CategoryFormPage extends BaseTestPage<CategoryFormComponent> {
  constructor(public fixture: ComponentFixture<CategoryFormComponent>) {
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

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let categoryFormPage: CategoryFormPage;
  let store: Store;
  let service: CategoryService;
  let serviceSpy: jasmine.Spy;
  const title = 'Test Category';
  const btnName = 'Add';
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [CategoryService],
        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          NgxsModule.forRoot([FileUploadState, CategoryState])
        ],
        declarations: [CategoryFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    component.nameSaveButton = btnName;
    component.title = title;

    categoryFormPage = new CategoryFormPage(fixture);
    service = TestBed.get(CategoryService);
    serviceSpy = spyOn(service, 'apiV1CategoryByIdGet').and.callFake((id: number) => of(CategoriesMock.filter(x => x.id === id)[0]));

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  describe('Functionality Tests', () => {

    it('should populate value to image url in form when file upload changed', () => {
      const uploadFileModel: UploadFileModel = FileUploadMocks[0];
      expect(
        component.categoryForm.controls['imageUrl'].value
      ).not.toContain(uploadFileModel.fileUrl);
      expect(
        component.categoryForm.controls['imageName'].value
      ).not.toContain(uploadFileModel.fileName);

      store.dispatch(new AddFileImage(uploadFileModel));

      expect(component.categoryForm.controls['imageUrl'].value).toContain(
        uploadFileModel.fileUrl
      );
      expect(component.categoryForm.controls['imageName'].value).toContain(
        uploadFileModel.fileName
      );
    });
    it('should remove image url in form value when image deleted', () => {
      const uploadFileModel: UploadFileModel = FileUploadMocks[0];
      store.dispatch(new AddFileImage(uploadFileModel));

      expect(component.categoryForm.controls['imageUrl'].value).toContain(
        uploadFileModel.fileUrl
      );
      expect(component.categoryForm.controls['imageName'].value).toContain(
        uploadFileModel.fileName
      );

      store.dispatch(new DeleteFileImage(uploadFileModel.fileName));

      expect(
        component.categoryForm.controls['imageUrl'].value
      ).not.toContain(uploadFileModel.fileUrl);
      expect(
        component.categoryForm.controls['imageName'].value
      ).not.toContain(uploadFileModel.fileName);
    });
  });

  describe('UI Tests', () => {
    it('should render correct Title', () => {
      expect(categoryFormPage.title.innerText).toContain(title);
    });
    it('should render correct save button name', () => {
      expect(categoryFormPage.saveBtn.innerText).toContain(btnName);
    });
    it('should disabled save button when form pristine', () => {
      expect(
        categoryFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
    });
    it('should disabled save button when form invalid', () => {
      // Name Field Null => invalid
      expect(
        categoryFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
      component.categoryForm.markAsTouched();
      component.categoryForm.markAsDirty();

      fixture.detectChanges();
      expect(
        categoryFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
    });
    it('should render validation error message when input error', () => {
      component.categoryForm.patchValue({
        name: 'Test'
      });
      component.nameControl.markAsDirty();
      component.nameControl.markAsTouched();
      fixture.detectChanges();
      expect(categoryFormPage.nameInputGroup.children.length).toEqual(1);

      component.categoryForm.patchValue({
        name: ''
      });

      fixture.detectChanges();
      expect(categoryFormPage.nameInputGroup.children.length).toEqual(2);
      expect(
        categoryFormPage.nameInputGroup.children.item(1)
      ).toBeDefined();
    });
    it('should not render validation error message when input is pristine', () => {
      expect(component.nameControl.pristine).toBeTruthy();
      expect(component.nameControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(categoryFormPage.nameInputGroup.children.length).toEqual(1);
      expect(categoryFormPage.nameInputGroup.children.item(1)).toBeNull();
    });
    it('should enabled save button when form valid', () => {
      // Name Field Null => invalid
      expect(
        categoryFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();

      // Name Field Inputed
      component.categoryForm.patchValue({
        name: 'Test'
      });

      fixture.detectChanges();
      expect(categoryFormPage.saveBtn.hasAttribute('disabled')).toBeFalsy();
    });
  });
  describe('State Tests', () => {
    it('should populate value in input when selected category state exists', () => {
      store.dispatch(new FetchSingleCategory(CategoriesMock[0].id.toString()));
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.categoryForm.value).toEqual(CategoriesMock[0]);
    });
  })
});
