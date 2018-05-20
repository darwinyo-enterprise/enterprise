// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { EditProductComponent } from './edit-product.component';
// import { Store, NgxsModule } from '@ngxs/store';
// import {
//   Product,
//   ProductService
// } from '@enterprise/commerce/catalog-lib';
// import {
//   ProductViewModelsMock,
//   UpdateProduct,
//   ProductState,
//   SingleProductFetched,
//   FetchSingleProduct
// } from '@enterprise/commerce/product-lib';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { FileUploadState } from '@enterprise/material/file-upload';
// import { ActivatedRoute, convertToParamMap } from '@angular/router';
// import { of } from 'rxjs/observable/of';
// import { RouterTestingModule } from '@angular/router/testing';
// import { productRoutes } from '../product-routing.module';
// import { ListProductComponent } from '../list-product/list-product.component';
// import { AddProductComponent } from '../add-product/add-product.component';
// import { Observable } from 'rxjs';

// describe('EditProductComponent', () => {
//   let component: EditProductComponent;
//   let fixture: ComponentFixture<EditProductComponent>;
//   let store: Store;
//   let storeSpy: jasmine.Spy;
//   let service: ProductService;

//   beforeEach(
//     async(() => {
//       TestBed.configureTestingModule({
//         imports: [
//           HttpClientModule,
//           NgxsModule.forRoot([FileUploadState, ProductState])
//         ],
//         declarations: [
//           EditProductComponent],
//         schemas: [NO_ERRORS_SCHEMA],
//         providers: [
//           {
//             provide: ProductService, useValue: {
//               apiV1ProductByIdPut(): Observable<any> {
//                 return of();
//               },
//               apiV1ProductByIdGet(id: string) {
//                 return of(ProductViewModelsMock.filter(x => x.id === id)[0]);
//               }
//             }
//           },
//           {
//             provide: ActivatedRoute,
//             useValue: { paramMap: of(convertToParamMap({ id: 1 })) }
//           }]
//       }).compileComponents();
//     })
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EditProductComponent);
//     component = fixture.componentInstance;
//     store = TestBed.get(Store);
//     service = TestBed.get(ProductService);
//     storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
//     fixture.detectChanges();
//   });
//   describe('UI Tests', () => { });
//   describe('Functional Tests', () => {
//     it('should dispatch update product', () => {
//       const product = ProductViewModelsMock[0];
//       component.onProductUpdate(product);
//       expect(store.dispatch).toHaveBeenCalledWith(new UpdateProduct(product));
//     })
//     it('should dispatch fetch single product on init', () => {
//       component.ngOnInit();
//       expect(store.dispatch).toHaveBeenCalled();
//     })
//   });
// });
