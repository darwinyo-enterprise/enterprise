// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ProductFormComponent } from './product-form.component';
// import { BaseTestPage } from '@enterprise/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { NgxsModule, Store } from '@ngxs/store';
// import { FileUploadState, AddFileImage, FileUploadMocks, DeleteFileImage, UploadFileModel } from '@enterprise/material/file-upload';
// import { ProductState, FetchSingleProduct, ProductViewModelsMock } from '@enterprise/commerce/product-lib';
// import { ProductService } from '@enterprise/commerce/catalog-lib';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { of } from 'rxjs';

// export class ProductFormPage extends BaseTestPage<
//   ProductFormComponent
//   > {
//   constructor(public fixture: ComponentFixture<ProductFormComponent>) {
//     super(fixture);
//   }
//   get saveBtn() {
//     return this.query<HTMLButtonElement>('#save-button');
//   }
//   get nameInputGroup() {
//     return this.query<HTMLElement>('#name-txtbox');
//   }
//   get nameInputControl(): HTMLInputElement {
//     return <HTMLInputElement>this.nameInputGroup.children.item(0);
//   }
//   get descriptionInputControl() {
//     return this.query<HTMLElement>('#description');
//   }
//   get title() {
//     return this.query<HTMLElement>('.form-card__title');
//   }
// }

// describe('ProductFormComponent', () => {
//   let component: ProductFormComponent;
//   let fixture: ComponentFixture<ProductFormComponent>;
//   let productFormPage: ProductFormPage;
//   let store: Store;
//   let service: ProductService;
//   let serviceSpy: jasmine.Spy;
//   const title = 'Test Product';
//   const btnName = 'Add';
//   beforeEach(
//     async(() => {
//       TestBed.configureTestingModule({
//         providers: [ProductService],
//         imports: [
//           HttpClientModule,
//           ReactiveFormsModule,
//           NgxsModule.forRoot([FileUploadState, ProductState])
//         ],
//         declarations: [ProductFormComponent],
//         schemas: [NO_ERRORS_SCHEMA],
//       }).compileComponents();
//     })
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ProductFormComponent);
//     component = fixture.componentInstance;
//     component.nameSaveButton = btnName;
//     component.title = title;

//     productFormPage = new ProductFormPage(fixture);
//     service = TestBed.get(ProductService);
//     serviceSpy = spyOn(service, 'apiV1ProductByIdGet').and.callFake((id: number) => of(ProductViewModelsMock.filter(x => x.id === id.toString())[0]));

//     store = TestBed.get(Store);
//     fixture.detectChanges();
//   });

//   describe('Functionality Tests', () => {

//     it('should populate value to image url in form when file upload changed', () => {
//       const uploadFileModel: UploadFileModel = FileUploadMocks[0];
//       expect(
//         component.productForm.controls['imageUrl'].value
//       ).not.toContain(uploadFileModel.fileUrl);
//       expect(
//         component.productForm.controls['imageName'].value
//       ).not.toContain(uploadFileModel.fileName);

//       store.dispatch(new AddFileImage(uploadFileModel));

//       expect(component.productForm.controls['imageUrl'].value).toContain(
//         uploadFileModel.fileUrl
//       );
//       expect(component.productForm.controls['imageName'].value).toContain(
//         uploadFileModel.fileName
//       );
//     });
//     it('should remove image url in form value when image deleted', () => {
//       const uploadFileModel: UploadFileModel = FileUploadMocks[0];
//       store.dispatch(new AddFileImage(uploadFileModel));

//       expect(component.productForm.controls['imageUrl'].value).toContain(
//         uploadFileModel.fileUrl
//       );
//       expect(component.productForm.controls['imageName'].value).toContain(
//         uploadFileModel.fileName
//       );

//       store.dispatch(new DeleteFileImage(uploadFileModel.fileName));

//       expect(
//         component.productForm.controls['imageUrl'].value
//       ).not.toContain(uploadFileModel.fileUrl);
//       expect(
//         component.productForm.controls['imageName'].value
//       ).not.toContain(uploadFileModel.fileName);
//     });
//   });

//   describe('UI Tests', () => {
//     it('should render correct Title', () => {
//       expect(productFormPage.title.innerText).toContain(title);
//     });
//     it('should render correct save button name', () => {
//       expect(productFormPage.saveBtn.innerText).toContain(btnName);
//     });
//     it('should disabled save button when form pristine', () => {
//       expect(
//         productFormPage.saveBtn.hasAttribute('disabled')
//       ).toBeTruthy();
//     });
//     it('should disabled save button when form invalid', () => {
//       // Name Field Null => invalid
//       expect(
//         productFormPage.saveBtn.hasAttribute('disabled')
//       ).toBeTruthy();
//       component.productForm.markAsTouched();
//       component.productForm.markAsDirty();

//       fixture.detectChanges();
//       expect(
//         productFormPage.saveBtn.hasAttribute('disabled')
//       ).toBeTruthy();
//     });
//     it('should render validation error message when input error', () => {
//       component.productForm.patchValue({
//         name: 'Test'
//       });
//       component.nameControl.markAsDirty();
//       component.nameControl.markAsTouched();
//       fixture.detectChanges();
//       expect(productFormPage.nameInputGroup.children.length).toEqual(1);

//       component.productForm.patchValue({
//         name: ''
//       });

//       fixture.detectChanges();
//       expect(productFormPage.nameInputGroup.children.length).toEqual(2);
//       expect(
//         productFormPage.nameInputGroup.children.item(1)
//       ).toBeDefined();
//     });
//     it('should not render validation error message when input is pristine', () => {
//       expect(component.nameControl.pristine).toBeTruthy();
//       expect(component.nameControl.invalid).toBeTruthy();
//       fixture.detectChanges();

//       expect(productFormPage.nameInputGroup.children.length).toEqual(1);
//       expect(productFormPage.nameInputGroup.children.item(1)).toBeNull();
//     });
//     it('should enabled save button when form valid', () => {
//       // Name Field Null => invalid
//       expect(
//         productFormPage.saveBtn.hasAttribute('disabled')
//       ).toBeTruthy();

//       // Name Field Inputed
//       component.productForm.patchValue({
//         name: 'Test'
//       });

//       fixture.detectChanges();
//       expect(productFormPage.saveBtn.hasAttribute('disabled')).toBeFalsy();
//     });
//   });
//   describe('State Tests', () => {
//     it('should populate value in input when selected product state exists', () => {
//       store.dispatch(new FetchSingleProduct(ProductViewModelsMock[0].id.toString()));
//       component.ngOnChanges();
//       fixture.detectChanges();

//       expect(component.productForm.value).toEqual(ProductViewModelsMock[0]);
//     });
//   })
// });
