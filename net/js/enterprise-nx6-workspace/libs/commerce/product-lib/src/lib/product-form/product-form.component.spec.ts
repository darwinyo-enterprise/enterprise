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
import { ProductViewModelsMock } from "../mocks/product-service.mock";
import { FetchSingleProduct } from "../shared/product.actions";
import { ProductState } from "../shared/product.state";

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
  get stockInputGroup() {
    return this.query<HTMLElement>('#stock-txtbox');
  }
  get stockInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.stockInputGroup.children.item(0);
  }
  get discountInputGroup() {
    return this.query<HTMLElement>('#discount-txtbox');
  }
  get discountInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.discountInputGroup.children.item(0);
  }
  get locationInputGroup() {
    return this.query<HTMLElement>('#location-txtbox');
  }
  get locationInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.locationInputGroup.children.item(0);
  }
  get minPurchaseInputGroup() {
    return this.query<HTMLElement>('#min-purchase-txtbox');
  }
  get minPurchaseInputControl(): HTMLInputElement {
    return <HTMLInputElement>this.minPurchaseInputGroup.children.item(0);
  }
  get hasExpiryInputControl(): HTMLInputElement {
    return this.query<HTMLInputElement>('#has-expire-checkbox');
  }
  get ExpireDateInputGroup() {
    return this.query<HTMLElement>('#expire-date-calender');
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
              configuration: {
                accessToken: ''
              },
              apiV1ManufacturerGet(): Observable<Manufacturer[]> {

                return of(ManufacturersMock);
              }
            }
          }, {
            provide: CategoryService, useValue: {
              configuration: {
                accessToken: ''
              },
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
      const images: ProductImage[] = component.imagesFormArray.value;
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
      const actual: ProductViewModel = component.productForm.value;
      const expectation: ProductViewModel = ProductViewModelsMock[0];
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
    it('should change has expire value on form and field when onHasExpireCheckboxChanged', () => {
      component.ngOnChanges();
      expect(component.hasExpiry).toBeTruthy();
      expect(component.productForm.value.hasExpiry).toBe(component.hasExpiry + '');
      component.onHasExpiryCheckbox();
      expect(component.hasExpiry).toBeFalsy();
      expect(component.productForm.value.hasExpiry).toBe(component.hasExpiry + '');
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
    it('should render validation error message when stock text box is error', () => {
      component.productForm.patchValue({
        stock: 1
      });
      component.stockControl.markAsDirty();
      component.stockControl.markAsTouched();
      fixture.detectChanges();
      expect(productFormPage.stockInputGroup.children.length).toEqual(1);

      component.productForm.patchValue({
        stock: null
      });

      fixture.detectChanges();
      expect(productFormPage.stockInputGroup.children.length).toEqual(2);
      expect(
        productFormPage.stockInputGroup.children.item(1)
      ).toBeDefined();
    })
    it('should not render validation error message when stock input is pristine', () => {
      component.productForm.patchValue({
        stock: null
      });
      expect(component.stockControl.pristine).toBeTruthy();
      expect(component.stockControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(productFormPage.stockInputGroup.children.length).toEqual(1);
      expect(productFormPage.stockInputGroup.children.item(1)).toBeNull();
    });

    it('should render validation error message when discount text box is error', () => {
      component.productForm.patchValue({
        discount: 1
      });
      component.discountControl.markAsDirty();
      component.discountControl.markAsTouched();
      fixture.detectChanges();
      expect(productFormPage.discountInputGroup.children.length).toEqual(1);

      component.productForm.patchValue({
        discount: null
      });

      fixture.detectChanges();
      expect(productFormPage.discountInputGroup.children.length).toEqual(2);
      expect(
        productFormPage.discountInputGroup.children.item(1)
      ).toBeDefined();
    })
    it('should not render validation error message when discount input is pristine', () => {

      component.productForm.patchValue({
        discount: null
      });
      expect(component.discountControl.pristine).toBeTruthy();
      expect(component.discountControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(productFormPage.discountInputGroup.children.length).toEqual(1);
      expect(productFormPage.discountInputGroup.children.item(1)).toBeNull();
    });

    it('should render validation error message when location text box is error', () => {
      component.productForm.patchValue({
        location: 'New York'
      });
      component.locationControl.markAsDirty();
      component.locationControl.markAsTouched();
      fixture.detectChanges();
      expect(productFormPage.locationInputGroup.children.length).toEqual(1);

      component.productForm.patchValue({
        location: null
      });

      fixture.detectChanges();
      expect(productFormPage.locationInputGroup.children.length).toEqual(2);
      expect(
        productFormPage.locationInputGroup.children.item(1)
      ).toBeDefined();
    })
    it('should not render validation error message when location input is pristine', () => {
      component.productForm.patchValue({
        location: null
      });
      expect(component.locationControl.pristine).toBeTruthy();
      expect(component.locationControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(productFormPage.locationInputGroup.children.length).toEqual(1);
      expect(productFormPage.locationInputGroup.children.item(1)).toBeNull();
    });

    it('should render validation error message when min purchase text box is error', () => {
      component.productForm.patchValue({
        minPurchase: 1
      });
      component.minPurchaseControl.markAsDirty();
      component.minPurchaseControl.markAsTouched();
      fixture.detectChanges();
      expect(productFormPage.minPurchaseInputGroup.children.length).toEqual(1);

      component.productForm.patchValue({
        minPurchase: null
      });

      fixture.detectChanges();
      expect(productFormPage.minPurchaseInputGroup.children.length).toEqual(2);
      expect(
        productFormPage.minPurchaseInputGroup.children.item(1)
      ).toBeDefined();
    })
    it('should not render validation error message when min purchase input is pristine', () => {

      component.productForm.patchValue({
        minPurchase: null
      });
      expect(component.minPurchaseControl.pristine).toBeTruthy();
      expect(component.minPurchaseControl.invalid).toBeTruthy();
      fixture.detectChanges();

      expect(productFormPage.minPurchaseInputGroup.children.length).toEqual(1);
      expect(productFormPage.minPurchaseInputGroup.children.item(1)).toBeNull();
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
        price: 200,
        stock:1,
        discount:10,
        location:'New York',
        minPurchase:1,
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

    it('should show hide expire date control when checkbox changed', () => {
      component.hasExpiry = true;
      fixture.detectChanges();
      expect(productFormPage.ExpireDateInputGroup).toBeDefined();
      component.hasExpiry = false;
      fixture.detectChanges();
      expect(productFormPage.ExpireDateInputGroup).toBeNull();
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
