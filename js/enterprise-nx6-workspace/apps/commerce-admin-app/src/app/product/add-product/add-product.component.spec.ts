import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponent } from './add-product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ProductService
} from '@enterprise/commerce/catalog-lib';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState, ClearFileUpload } from '@enterprise/material/file-upload';
import {
  ProductState,
  ProductViewModelsMock,
  AddProduct,
  ClearSelectedProduct
} from '@enterprise/commerce/product-lib';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let store: Store;
  let addProductSpy: jasmine.Spy;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          NgxsModule.forRoot([FileUploadState, ProductState])
        ],
        declarations: [AddProductComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{
          provide: ProductService, useValue: {
            apiV1ProductPost(): Observable<any> {

              return of();
            }
          }
        },]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(Store);
    addProductSpy = spyOn(
      component,
      'onAddNewProduct'
    ).and.callThrough();
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('UI Tests', () => { });
  describe('Functional Tests', () => {
    it('should dispatch add product', () => {
      const product = ProductViewModelsMock[0];
      component.onAddNewProduct(product);
      expect(component.onAddNewProduct).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(new AddProduct(product));
    });
    it('should dispatch Clear Selected Product, and clear file upload when on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith([ClearSelectedProduct, ClearFileUpload]);
    })
  });
});
