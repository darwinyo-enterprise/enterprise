import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListProductComponent } from './list-product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store, StateContext } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import {
    ProductState,
    FetchSingleProduct,
    FetchProducts,
    AddProduct,
    DeleteProduct,
    FetchPaginatedProductsList
} from '@enterprise/commerce/product-lib';
import { ProductService, Product, ProductViewModel } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { productRoutes } from '../product-routing.module';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { Location } from "@angular/common";
import { Navigate, RegisterLoadingOverlay, Confirm } from '@enterprise/core';
import { ProductStateModel, ProductViewModelsMock } from '@enterprise/commerce/product-lib';
import { Observable } from 'rxjs';
import { IPageChangeEvent } from '@covalent/core';
import { take } from 'rxjs/operators';
import { ChangePagination } from '@enterprise/material/list-item-actions';

describe('ListProductComponent', () => {
    let component: ListProductComponent;
    let fixture: ComponentFixture<ListProductComponent>;
    let store: Store;
    let storeSpy: jasmine.Spy;
    let router: Router;
    let route: ActivatedRoute;
    let location: Location;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule,
                    RouterTestingModule.withRoutes(productRoutes),
                    NgxsModule.forRoot([FileUploadState, ProductState])
                ],
                declarations: [
                    ListProductComponent,
                    AddProductComponent,
                    EditProductComponent
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    {
                        provide: ProductService, useValue: {
                            apiV1ProductListGet(): Observable<ProductViewModel[]> {

                                return of(ProductViewModelsMock);
                            }
                        }
                    },
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            params: of({ id: 123 })
                        }
                    }]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ListProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.get(Router);
        location = TestBed.get(Location);
        route = TestBed.get(ActivatedRoute);
        store = TestBed.get(Store);
        storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
        router.initialNavigation();
    });

    describe('UI Tests', () => {
    });

    describe('Functional Tests', () => {
        it('should dispatch navigate event to add when addEvent Triggered', () => {
            component.onAddNewProduct();
            expect(store.dispatch).toHaveBeenCalledWith(new Navigate({
                extras: {
                    relativeTo: route
                },
                commands: ['../add']
            }))
        });

        it('should dispatch confirm event when deleteEvent triggered', () => {
            component.onDeleteProduct('1');
            expect(store.dispatch).toHaveBeenCalledWith(new Confirm(component.confirmModel, component.deleteSubject$));
        });

        it('should dispatch delete product event when confirmed event triggered is true', () => {
            component.onDeleteProduct('1');
            component.deleteSubject$.next(true);
            expect(store.dispatch).toHaveBeenCalledWith(new DeleteProduct('1'));
        });

        it('should dispatch fetch products when component on init', () => {
            component.ngOnInit();
            expect(store.dispatch).toHaveBeenCalledWith(new FetchPaginatedProductsList({ page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 }));
        });

        it('should dispatch fetch paginated products when pagination changed', () => {
            var pageInfo: IPageChangeEvent = { page: 1, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 };

            component.onPaginationChanged();
            component.pageInfo$.pipe(take(1)).subscribe(x => {
                expect(store.dispatch).toHaveBeenCalledWith(new FetchPaginatedProductsList(x));
            })

            store.dispatch(new ChangePagination(pageInfo));
        });
    });
});
