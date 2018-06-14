import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogItemViewModel } from '@enterprise/commerce/catalog-lib';
import { CatalogItemViewModelMock } from '../mocks/CatalogItemViewModelMocks';

export class ProductCardComponentPage extends BaseTestPage<ProductCardComponent> {
  constructor(public fixture: ComponentFixture<ProductCardComponent>) {
    super(fixture);
  }
  get card() {
    return this.query<HTMLImageElement>(".card-item");
  }
  get cardImage() {
    return this.query<HTMLImageElement>(".card-item__image > img");
  }
  get cardTitle() {
    return this.query<HTMLElement>('.card-item__title');
  }
  get cardStars() {
    return this.query<HTMLElement>('em-star-container');
  }
  get cardDetailPrice() {
    return this.query<HTMLElement>('.card-item__detail__price');
  }
  get cardDetailFavorite() {
    return this.query<HTMLElement>('.card-item__detail__favorite');
  }
  get cardDetailReviews() {
    return this.query<HTMLElement>('.card-item__detail__reviews');
  }
}

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let page: ProductCardComponentPage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new ProductCardComponentPage(fixture);
  });

  describe('UI Tests', () => {
    beforeEach(() => {
      component.productViewModel = CatalogItemViewModelMock;
      fixture.detectChanges();
    })
    it('should display image correctly', () => {
      expect(page.cardImage.attributes.getNamedItem("src").textContent).toContain(CatalogItemViewModelMock.imageUrl);
    })
    it('should render name', () => {
      expect(page.cardTitle.textContent).toContain(CatalogItemViewModelMock.name);
    })
    it('should render star rate', () => {
      expect(page.cardStars).toBeTruthy();
    })
    it('should render price', () => {
      expect(page.cardDetailPrice.textContent).toContain(CatalogItemViewModelMock.price.toString());
    })
    it('should render favorite', () => {
      expect(page.cardDetailFavorite.textContent).toContain(CatalogItemViewModelMock.totalFavorites.toString());
    })
    it('should render reviewer count', () => {
      expect(page.cardDetailReviews.textContent).toContain(CatalogItemViewModelMock.totalReviews.toString());
    })

  })
  describe('Functionality Tests', () => {
    it('should dispatch clicked event when card clicked', () => {
      component.productViewModel = CatalogItemViewModelMock;
      fixture.detectChanges();
      let viewModel: CatalogItemViewModel;
      component.productCardClicked.subscribe(x=>viewModel=x);
      page.card.click();
      expect(viewModel).toBeTruthy(component.productViewModel);
    })
  })
});
