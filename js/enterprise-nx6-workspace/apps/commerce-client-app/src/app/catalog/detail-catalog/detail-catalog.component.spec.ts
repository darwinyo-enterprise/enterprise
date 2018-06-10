import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCatalogComponent } from './detail-catalog.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import { ProductState } from '@enterprise/commerce/product-lib';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoryService, ProductDetailViewModel, ProductService } from '@enterprise/commerce/catalog-lib/src';
import { Observable, of } from 'rxjs';
import { ProductDetailViewModelMocks } from '@enterprise/commerce/product-lib/src';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

export class DetailCatalogPage extends BaseTestPage<DetailCatalogComponent> {
  constructor(public fixture: ComponentFixture<DetailCatalogComponent>) {
    super(fixture);
  }

  get productDetailTitle() {
    return this.query<HTMLElement>(".product-detail__title");
  }
  get productDetailPrice() {
    return this.query<HTMLElement>(".product-detail__price");
  }
  get productDetailLastUpdated() {
    return this.query<HTMLElement>(".product-detail__last-updated");
  }
  get productDetailInfos() {
    return this.queryAll<HTMLElement>(".product-detail__info__container");
  }
  get productDetailActionTitle() {
    return this.query<HTMLElement>(".product-detail-action__title");
  }
  get productDetailActionPrice() {
    return this.query<HTMLElement>(".product-detail-action__price");
  }
  get productDetailActionDiscount() {
    return this.query<HTMLElement>(".product-detail-action__discount");
  }
  get productDetailActionStock() {
    return this.query<HTMLElement>(".product-detail-action__stock");
  }
  get productDetailActionWishlist() {
    return this.query<HTMLElement>(".product-detail-action__wishlist");
  }
  get productDetailActionFavorite() {
    return this.query<HTMLElement>(".product-detail-action__favorites-btn");
  }
  get productDetailDescriptionContent() {
    return this.query<HTMLElement>(".product-detail__container__description__content");
  }
  get colorChips() {
    return this.queryAll<HTMLElement>(".product-detail__color-chip");
  }
  get addCartButton() {
    return this.query<HTMLButtonElement>(".product-detail-action__add-to-card-btn");
  }
  get wishlishButton() {
    return this.query<HTMLButtonElement>(".product-detail-action__wishlist");
  }
  get favoriteButton() {
    return this.query<HTMLButtonElement>(".product-detail-action__favorites-btn");
  }
  get shareButton() {
    return this.query<HTMLButtonElement>(".product-detail-action__share-btn");
  }
  get reportButton() {
    return this.query<HTMLButtonElement>(".product-detail-action__report-btn");
  }
}

describe('DetailCatalogComponent', () => {
  let component: DetailCatalogComponent;
  let fixture: ComponentFixture<DetailCatalogComponent>;
  let page: DetailCatalogPage;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCatalogComponent],
      imports: [
        HttpClientModule,
        NgxsModule.forRoot([ProductState])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ProductService, useValue: {
            apiV1ProductInfoByIdGet(id: string): Observable<ProductDetailViewModel> {

              return of(ProductDetailViewModelMocks);
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: 1 })) }
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCatalogComponent);
    component = fixture.componentInstance;
    page = new DetailCatalogPage(fixture);
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  describe('UI Test', () => {
    it('should render correct title', () => {
      expect(page.productDetailActionTitle.innerHTML).toContain(ProductDetailViewModelMocks.name);
      expect(page.productDetailTitle.innerHTML).toContain(ProductDetailViewModelMocks.name);
    })
    it('should render correct price', () => {
      expect(page.productDetailActionPrice.innerHTML).toContain('$ ' + ProductDetailViewModelMocks.price);
      expect(page.productDetailPrice.innerHTML).toContain('$ ' + ProductDetailViewModelMocks.price);
    })
    it('should render correct last update', () => {
      expect(page.productDetailLastUpdated.innerHTML).toContain(ProductDetailViewModelMocks.lastUpdated);
    })
    it('should render correct location', () => {
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("LOCATION :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.location);
    })
    it('should render correct total sold', () => {
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("SOLD :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.sold);
    })
    it('should render correct manufacturer name', () => {
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("MANUFACTURER :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.manufacturerName);
    })
    it('should render correct expiry date', () => {
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("EXPIRY DATE :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.expireDate);
    })
    it('should render correct min purchase', () => {
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("MIN PURCHASE :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.minPurchase)
    })
    it('should render correct has expiry', () => {
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("HAS EXPIRY :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.hasExpiry)
    })
    it('should render correct discount', () => {
      expect(page.productDetailActionDiscount.innerHTML).toContain(ProductDetailViewModelMocks.discount + "%");
    })
    it('should render correct stock', () => {
      expect(page.productDetailActionStock.innerHTML).toContain(ProductDetailViewModelMocks.stock + " pcs");
    })
    it('should render correct wishlist count', () => {
      expect(page.productDetailActionWishlist.innerHTML).toContain(ProductDetailViewModelMocks.wishlistCount + " Wishlists");
    })
    it('should render correct favorite', () => {
      expect(page.productDetailActionFavorite.innerHTML).toContain("Favorite (" + ProductDetailViewModelMocks.favorites + ")");
    })
    it('should render correct description', () => {
      expect(page.productDetailDescriptionContent.innerHTML).toContain(ProductDetailViewModelMocks.description);
    })
  })
  describe('Functional Test', () => {
    it('should display - when hasexpirydate = false', () => {
      component.productDetail.hasExpiry = "False";
      fixture.detectChanges();
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("EXPIRY DATE :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain('-');
    })
    it('should display date when hasexpirydate = true', () => {
      component.productDetail.hasExpiry = "True";
      fixture.detectChanges();
      const el = [].slice.call(page.productDetailInfos);
      const valueEl = el.filter(x => (<string>x.innerHTML).toUpperCase().includes("EXPIRY DATE :"))[0].children.item(1);
      expect(valueEl.innerHTML).toContain(ProductDetailViewModelMocks.expireDate);
    })
    it('should change price when quantity counter changed', () => {
      const old = page.productDetailActionPrice.innerHTML;

      component.quantity = 12;
      fixture.detectChanges();
      expect(page.productDetailActionPrice.innerHTML).not.toEqual(old);
    })
  })
});
