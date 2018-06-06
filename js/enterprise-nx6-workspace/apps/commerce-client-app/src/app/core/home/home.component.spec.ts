import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductService, PaginatedCatalogViewModelCatalogItemViewModel } from '@enterprise/commerce/catalog-lib/src';
import { Observable, of } from 'rxjs';
import { PaginatedCatalogItemViewModelMock } from '@enterprise/commerce/product-lib';
import { BaseTestPage } from '@enterprise/core/testing';

export class HomeComponentPage extends BaseTestPage<
  HomeComponent
  > {
  constructor(public fixture: ComponentFixture<HomeComponent>) {
    super(fixture);
  }
  get productCards() {
    return this.queryAll<HTMLElement>('eca-product-card');
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let page: HomeComponentPage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            apiV1ProductHotGet(): Observable<PaginatedCatalogViewModelCatalogItemViewModel> {
              return of(PaginatedCatalogItemViewModelMock);
            },
            apiV1ProductLatestGet(): Observable<PaginatedCatalogViewModelCatalogItemViewModel> {
              return of(PaginatedCatalogItemViewModelMock);
            }
          }
        }
      ],
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new HomeComponentPage(fixture);
  });

  describe('UI Test', () => {
    it('should populate recent product when defined', () => {
      let productLength: number;
      component.newProducts.subscribe(x => productLength = x.length);
      component.ngOnInit();
      expect(page.productCards.length).toBe(productLength);
    })
    it('should populate recent product when defined', () => {
      let productLength: number;
      component.hotProducts.subscribe(x => productLength = x.length);
      component.ngOnInit();
      expect(page.productCards.length).toBe(productLength);
    })
  })
  describe('Functionality Test', () => {
    it('should dispatch navigate to product detail when productCardClicked', () => {
      expect(true).toBeFalsy();
    })
    it('should dispatch fetch latest product and fetch hot product on init', () => {
      expect(true).toBeFalsy();
    })
  })
});
