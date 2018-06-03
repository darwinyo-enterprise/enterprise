import { ProductFormComponent } from "./product-form.component";
import { BaseTestPage } from "@enterprise/core/testing";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Store, NgxsModule } from "@ngxs/store";
import { ProductService, ManufacturerService, Manufacturer, CategoryService, Category, ProductViewModel, ProductImage } from "@enterprise/commerce/catalog-lib";
import { Observable } from "rxjs/Observable";
import { ManufacturersMock, ManufacturerState, FetchManufacturers } from "@enterprise/commerce/manufacturer-lib";
import { of } from "rxjs/observable/of";
import { CategoriesMock, CategoryState, FetchCategories } from "@enterprise/commerce/category-lib";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FileUploadState, UploadFileModel, FileUploadMocks, AddFileImage, DeleteFileImage, SetModeFileUpload } from "@enterprise/material/file-upload";
import { ProductState, ProductViewModelsMock, FetchSingleProduct } from "@enterprise/commerce/product-lib";


export class ProductFormPage extends BaseTestPage<
  ProductFormComponent
  > {
  constructor(public fixture: ComponentFixture<ProductFormComponent>) {
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
  get priceInputGroup() {
    return this.query<HTMLElement>('#price-txtbox');
  }
  get priceInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.priceInputGroup.children.item(0);
  }
  get categoryInputGroup() {
    return this.query<HTMLElement>('#category-select');
  }
  get categoryInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.categoryInputGroup.children.item(0);
  }
  get manufacturerInputGroup() {
    return this.query<HTMLElement>('#manufacturer-select');
  }
  get manufacturerInputControl(): HTMLSelectElement {
    return <HTMLSelectElement>this.manufacturerInputGroup.children.item(0);
  }
  get chipColorInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.query<HTMLElement>('td-chips');
  }
  get descriptionInputControl() {
    return this.query<HTMLElement>('#description');
  }
  get title() {
    return this.query<HTMLElement>('.form-card__title');
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productFormPage: ProductFormPage;
  let store: Store;
  let storeSpy: jasmine.Spy;
  let service: ProductService;
  let serviceSpy: jasmine.Spy;
  const title = 'Test Product';
  const btnName = 'Add';
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [ProductService,
          {
            provide: ManufacturerService, useValue: {
              apiV1ManufacturerGet(): Observable<Manufacturer[]> {

                return of(ManufacturersMock);
              }
            }
          }, {
            provide: CategoryService, useValue: {
              apiV1CategoryGet(): Observable<Category[]> {

                return of(CategoriesMock);
              }
            }
          }],
        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          NgxsModule.forRoot([FileUploadState, ProductState, ManufacturerState, CategoryState])
        ],
        declarations: [ProductFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    component.nameSaveButton = btnName;
    component.title = title;

    productFormPage = new ProductFormPage(fixture);
    service = TestBed.get(ProductService);
    serviceSpy = spyOn(service, 'apiV1ProductByIdGet').and.callFake(
      (id: number) =>
        of(ProductViewModelsMock.filter(x => x.id === id.toString())[0]));

    store = TestBed.get(Store);

    store.dispatch(new FetchSingleProduct(ProductViewModelsMock[0].id));
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  describe('Functionality Tests', () => {
    it('should populate value to image url in form when file upload changed', () => {
      const uploadFileModel: UploadFileModel[] = FileUploadMocks;
      expect(component.imagesFormArray.length).toBe(0);

      store.dispatch(new AddFileImage(uploadFileModel));

      expect(component.imagesFormArray.length).toBe(uploadFileModel.length);
      var images: ProductImage[] = component.imagesFormArray.value;
      expect(images[0].imageName).toContain(
        uploadFileModel[0].fileName
      );
      expect(images[0].imageUrl).toContain(
        uploadFileModel[0].fileUrl
      );
    });
    it('should remove image url in form value when image deleted', () => {
      expect(component.imagesFormArray.length).toBe(0);

      const uploadFileModel: UploadFileModel[] = FileUploadMocks;
      store.dispatch(new AddFileImage(uploadFileModel));

      expect(component.imagesFormArray.length).toBe(uploadFileModel.length);

      expect(component.imagesFormArray.value[0].imageName).toContain(
        uploadFileModel[0].fileName
      );
      expect(component.imagesFormArray.value[0].imageUrl).toContain(
        uploadFileModel[0].fileUrl
      );

      store.dispatch(new DeleteFileImage(uploadFileModel[0].fileName));

      expect(component.imagesFormArray.length).toBe(uploadFileModel.length - 1);
      expect(component.imagesFormArray.value[0].imageName).not.toContain(
        uploadFileModel[0].fileName
      );
    });
    it('should dispatch fetch categories and manufacturers for select controls on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith([FetchCategories, FetchManufacturers]);
    })
    it('should populate product Form correctly when product selected has value', () => {
      component.ngOnInit();
      component.ngOnChanges();
      let actual: ProductViewModel = component.productForm.value;
      let expectation: ProductViewModel = ProductViewModelsMock[0];
      expect(actual.name).toBe(expectation.name);
      expect(actual.productColors.length).toBe(expectation.productColors.length);
      expect(actual.productImages.length).toBe(expectation.productImages.length);
      expect(actual.price).toBe(expectation.price);
      expect(actual.description).toBe(expectation.description);
      expect(actual.actorId).toBe(expectation.actorId);
      expect(actual.manufacturerId).toBe(expectation.manufacturerId);
      expect(actual.manufacturerName).toBe(expectation.manufacturerName);
      expect(actual.categoryId).toBe(expectation.categoryId);
      expect(actual.categoryName).toBe(expectation.categoryName);
    })
    it('should populate File image state when product selected defined', () => {
      component.productViewModel$.subscribe(x => {
        expect(x.productImages.length).toBe(ProductViewModelsMock[0].productImages.length);
        expect(x.productImages[0].imageName).toBe(ProductViewModelsMock[0].productImages[0].imageName);
        expect(x.productImages[0].imageUrl).toBe(ProductViewModelsMock[0].productImages[0].imageUrl);
      })
      component.ngOnInit();
    })
    it('should dispatch file upload mode to multiple', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SetModeFileUpload(true));
    })
    it('should emit save event when save btn clicked', () => {
      component.save.subscribe(x => expect(true).toBeTruthy());
      productFormPage.saveBtn.click();
    })

    it('should emit save event with correct product form value when save btn clicked', () => {
      component.save.subscribe(x => expect(x).toBeTruthy(component.productForm.value));
      productFormPage.saveBtn.click();
    })
  });

  describe('UI Tests', () => {
    it('should render correct Title', () => {
      expect(productFormPage.title.innerText).toContain(title);
    });
    it('should render correct save button name', () => {
      expect(productFormPage.saveBtn.innerText).toContain(btnName);
    });
    it('should disabled save button when form pristine', () => {
      expect(
        productFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
    });
    it('should disabled save button when form invalid', () => {
      // Name Field Null => invalid
      expect(
        productFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
      component.productForm.markAsTouched();
      component.productForm.markAsDirty();

      fixture.detectChanges();
      expect(
        productFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();
    });
    it('should render validation error message when input error', () => {
      component.productForm.patchValue({
        name: 'Test'
      });
      component.nameControl.markAsDirty();
      component.nameControl.markAsTouched();
      fixture.detectChanges();
      expect(productFormPage.nameInputGroup.children.length).toEqual(1);

      component.productForm.patchValue({
        name: ''
      });

      fixture.detectChanges();
      expect(productFormPage.nameInputGroup.children.length).toEqual(2);
      expect(
        productFormPage.nameInputGroup.children.item(1)
      ).toBeDefined();
    });
    it('should not render validation error message when input is pristine', () => {
      expect(component.nameControl.pristine).toBeTruthy();
      expect(component.nameControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(productFormPage.nameInputGroup.children.length).toEqual(1);
      expect(productFormPage.nameInputGroup.children.item(1)).toBeNull();
    });
    it('should enabled save button when form valid', () => {
      // Name Field Null => invalid
      expect(
        productFormPage.saveBtn.hasAttribute('disabled')
      ).toBeTruthy();

      // Name Field Inputed
      component.productForm.patchValue({
        name: 'Test',
        categoryId: "1",
        manufacturerId: "1",
        price: 200
      });

      fixture.detectChanges();
      expect(productFormPage.saveBtn.hasAttribute('disabled')).toBeFalsy();
    });

    it('should render validation error message when price control is null', () => {
      productFormPage.priceInputControl.value = "";
      component.nameControl.markAsDirty();
      component.nameControl.markAsTouched();
      fixture.detectChanges();

      expect(productFormPage.nameInputGroup.children.length).toEqual(2);
      expect(
        productFormPage.nameInputGroup.children.item(1)
      ).toBeDefined();
    })
  });
  describe('State Tests', () => {
    it('should populate value in input when selected product state exists', () => {
      store.dispatch(new FetchSingleProduct(ProductViewModelsMock[0].id.toString()));
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.productForm.value).toEqual(ProductViewModelsMock[0]);
    });
  })
});
