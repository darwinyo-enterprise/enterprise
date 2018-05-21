import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { Select, Store } from '@ngxs/store';

import { AppState } from '@enterprise/core';
import { Guid } from '@enterprise/shared';
import { Product, ProductImage, Manufacturer, Category, ProductColor } from '@enterprise/commerce/catalog-lib';
import { FileUploadState, SetModeFileUpload, AddFileImage, ClearFileUpload, UploadFileModel } from '@enterprise/material/file-upload';
import { take } from 'rxjs/operators';
import { ProductState } from './../shared/product.state';
import { OnInit, OnChanges, OnDestroy, Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ProductViewModel } from '@enterprise/commerce/catalog-lib/api/model/productViewModel';
import { FetchCategories, CategoryState } from '@enterprise/commerce/category-lib';
import { FetchManufacturers, ManufacturerState } from '@enterprise/commerce';
import { TdChipsComponent } from '@covalent/core/chips';

@Component({

  selector: 'eca-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})

/**TODO: Make Interaction with backend with progress bar */
export class ProductFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('ColorChips')
  colorChips: TdChipsComponent;

  @Select(FileUploadState.getFileImages)
  fileImages: Observable<UploadFileModel[]>;

  @Select(ProductState.getSelectedProduct)
  productViewModel$: Observable<ProductViewModel>;

  @Select(ManufacturerState.getManufacturers)
  manufacturers$: Observable<Manufacturer[]>;

  @Select(CategoryState.getCategories)
  categories$: Observable<Category[]>;

  //#endregion

  //#region Inputs Outputs

  /** Title of form */
  @Input() title: string;

  /** Name Save Button */
  @Input() nameSaveButton: string;

  /** Save Event triggered When save Button clicked */
  @Output() save: EventEmitter<ProductViewModel>;

  //#endregion

  filesUpload$: Observable<UploadFileModel[]>;

  productForm: FormGroup;

  unsubscribe$: ReplaySubject<boolean>;

  product: ProductViewModel;

  constructor(private store: Store, private fb: FormBuilder) {
    this.createForm();

    this.save = new EventEmitter<ProductViewModel>();

    // buffer size 1.
    this.unsubscribe$ = new ReplaySubject(1);

  }

  ngOnInit() {
    this.product.id = '1';
    // Fetch all categories and manufacturers for select input
    this.store.dispatch([FetchCategories, FetchManufacturers]);

    // If Input Supplied (Edit Mode)
    // take 2 for make sure get latest selected product
    this.productViewModel$.pipe(take(2)).subscribe(x => {
      this.product = x;
    },
      (err) => alert(err),
      () => {
        if (this.product != null) {
          const images: UploadFileModel[] = this.product.productImages.map(x => <UploadFileModel>{
            id: x.id.toString(),
            fileName: x.imageName,
            fileUrl: x.imageUrl
          })
          this.store.dispatch([ClearFileUpload, new AddFileImage(images)]);
          this.rebuildForm();
        }
      })

    // Set Multiple to true
    this.store.dispatch(new SetModeFileUpload(true));

    this.fileImages
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(x => this.onFileInputChanged(x));
  }

  ngOnChanges(): void {
    this.rebuildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
    this.unsubscribe$.complete();
  }

  /** Name Form Control Getter */
  get nameControl(): AbstractControl {
    return this.productForm.controls['name'];
  }

  /** Price Form Control Getter */
  get priceControl(): AbstractControl {
    return this.productForm.controls['price'];
  }
  /** Manufacturer Control Getter */
  get manufacturerIdControl(): AbstractControl {
    return this.productForm.controls['manufacturerId'];
  }
  /** Category Control Getter */
  get categoryIdControl(): AbstractControl {
    return this.productForm.controls['categoryId'];
  }
  /** productColors Form Control Getter */
  get productColorsControl(): AbstractControl {
    return this.productForm.controls['productColors'];
  }
  /** Description Form Control Getter */
  get descriptionControl(): AbstractControl {
    return this.productForm.controls['description'];
  }

  /** Create Product Form By form builder */
  createForm() {
    this.productForm = this.fb.group({
      id: '',
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: '',
      manufacturerId: ['', Validators.required],
      categoryId: ['', Validators.required],
      productColors: this.fb.array([]),
      actorId: '',
      productImages: this.fb.array([]),
    });
  }

  /** resposible for change form value. 
   *  TODO: actor id should be set
  */
  rebuildForm() {
    this.productViewModel$.pipe(take(1)).subscribe((x) => {
      this.product = x;
    }, (err) => {
      alert('error')
    }, () => {
      this.productForm.reset({
        id: this.product.id || '',
        name: this.product.name || '',
        description: this.product.description || '',
        price: this.product.price || '',
        manufacturerId: this.product.manufacturerId || '',
        categoryId: this.product.categoryId || '',
        productColors: this.product.productColors || [],
        actorId: this.product.actorId || '',
        productImages: this.product.productImages || [],
      });
    })
  }

  //#region reset Form array values

  setProductImage(images: ProductImage[]) {
    const imageFGs = images.map(image => this.fb.group(image));
    const imageFormArray = this.fb.array(imageFGs);
    this.productForm.setControl('productImages', imageFormArray);
  }
  setProductColor(colors: string[]) {
    const colorFGs = colors.map(color => this.fb.group(<ProductColor>{
      name: color
    }));
    const colorFormArray = this.fb.array(colorFGs);
    this.productForm.setControl('productColors', colorFormArray);
  }

  //#endregion

  /** File Input Changed by Store Management */
  onFileInputChanged(uploadModel: UploadFileModel[]) {
    if (uploadModel.length > 0) {
      let images = uploadModel.map(x => <ProductImage>{
        id: +x.id,
        imageName: x.fileName,
        imageUrl: x.fileUrl
      })
      this.setProductImage(images);
    } else {
      this.setProductImage([]);
    }
  }

  /** Should be handled for each form.
   * add should hit add new api.
   * edit should hit update api.
   */
  onSaveBtnClicked() {
    this.save.emit(this.productForm.value);
  }

  /**Will update value of product color */
  onChipInputChanged(): void {
    this.setProductColor(this.colorChips.value);
  }
}