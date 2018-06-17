import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductService, PaginatedCatalogViewModelCatalogItemViewModel, CategoryService, Category, ManufacturerService, CatalogItemViewModel, Manufacturer } from '@enterprise/commerce/catalog-lib/src';
import { Observable, of } from 'rxjs';
import { PaginatedCatalogItemViewModelMock, ProductState, CatalogItemViewModelMock, FetchPaginatedLatestProductsList, FetchPaginatedHotProductsList } from '@enterprise/commerce/product-lib';
import { BaseTestPage } from '@enterprise/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { CategoryState, CategoriesMock, FetchPaginatedCategories } from '@enterprise/commerce/category-lib/src';
import { ManufacturerState, ManufacturersMock, FetchPaginatedManufacturers } from '@enterprise/commerce/manufacturer-lib/src';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Navigate, StorageService } from '@enterprise/core/src';

export class HomeComponentPage extends BaseTestPage<
  HomeComponent
  > {
  constructor(public fixture: ComponentFixture<HomeComponent>) {
    super(fixture);
  }
  get productCards() {
    return this.queryAll<HTMLElement>('eca-product-card');
  }
  get categoryCards() {
    return this.queryAll<HTMLElement>('eca-category-card');
  }
  get manufacturerCards() {
    return this.queryAll<HTMLElement>('eca-manufacturer-card');
  }
  get seeMoreButton() {
    return this.queryAll<HTMLElement>('.card-container__title__more-links');
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let page: HomeComponentPage;
  let store: Store;
  let storeSpy: jasmine.Spy;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            configuration: {
              accessToken: ''
            },
            apiV1ProductHotGet(): Observable<PaginatedCatalogViewModelCatalogItemViewModel> {
              return of(PaginatedCatalogItemViewModelMock);
            },
            apiV1ProductLatestGet(): Observable<PaginatedCatalogViewModelCatalogItemViewModel> {
              return of(PaginatedCatalogItemViewModelMock);
            }
          }
        },
        {
          provide: CategoryService, useValue: {
            configuration: {
              accessToken: ''
            },

            apiV1CategoryPaginatedGet(): Observable<Category[]> {

              return of(CategoriesMock);
            }
          }
        },
        {
          provide: ManufacturerService, useValue: {
            configuration: {
              accessToken: ''
            },
            apiV1ManufacturerPaginatedGet(): Observable<Category[]> {

              return of(ManufacturersMock);
            }
          }
        },
        {
          provide: StorageService, useValue: {
            retrieve(key: string): any {

              return 'test';
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 })
          }
        }
      ],
      imports: [
        HttpClientModule,
        NgxsModule.forRoot([ProductState, CategoryState, ManufacturerState])
      ],
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
    route = TestBed.get(ActivatedRoute);
    page = new HomeComponentPage(fixture);
    storeSpy = spyOn(store, "dispatch").and.callFake(() => { });
  });

  describe('UI Test', () => {
    it('should populate recent product and hot product when defined', () => {
      let productLength: number;
      component.newProducts.subscribe(x => productLength = x.length);
      component.ngOnInit();
      // Hot Product and Recent Product
      expect(page.productCards.length).toBe(productLength * 2);
    })
    it('should populate several category when defined', () => {
      let categoryLength: number;
      component.categories.subscribe(x => categoryLength = x.length);
      component.ngOnInit();
      expect(page.categoryCards.length).toBe(categoryLength);
    })
    it('should populate several manufacturer when defined', () => {
      let manufacturerLength: number;
      component.manufacturers.subscribe(x => manufacturerLength = x.length);
      component.ngOnInit();
      expect(page.manufacturerCards.length).toBe(manufacturerLength);
    })
  })
  describe('Functionality Test', () => {
    it('should dispatch navigate to product detail when productCardClicked', () => {
      const product: CatalogItemViewModel = CatalogItemViewModelMock;
      component.onProductCardClicked(product);

      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate({
          extras: {
            relativeTo: route
          },
          commands: ['../product-detail', product.catalogId]
        })
      )
    })
    it('should dispatch catalog list when category card clicked', () => {
      const category: Category = CategoriesMock[0];
      component.onCategoryCardClicked(category);

      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate({
          extras: {
            relativeTo: route
          },
          commands: ['../product-list/category', category.id]
        })
      )
    })
    it('should dispatch catalog list when manufacturer card clicked', () => {
      const manufacturer: Manufacturer = ManufacturersMock[0];
      component.onManufacturerCardClicked(manufacturer);

      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate({
          extras: {
            relativeTo: route
          },
          commands: ['../product-list/manufacturer', manufacturer.id]
        })
      )
    })
    it('should dispatch fetch latest product, fetch hot product, fetch paginated manufacturer, and categories on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith([FetchPaginatedHotProductsList, FetchPaginatedLatestProductsList, FetchPaginatedManufacturers, FetchPaginatedCategories]);
    })
  })
});
