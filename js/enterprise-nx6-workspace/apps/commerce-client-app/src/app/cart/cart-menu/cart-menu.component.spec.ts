import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartMenuComponent } from './cart-menu.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { Store, NgxsModule } from '@ngxs/store';
import { RouterState, Navigate } from '@enterprise/core/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartModelMock } from '../mocks/cart-model.mock';
export class CartMenuPage extends BaseTestPage<CartMenuComponent> {
  constructor(public fixture: ComponentFixture<CartMenuComponent>) {
    super(fixture);
  }
  get cartItem() {
    return this.queryAll<HTMLElement>(".cart-menu__item");
  }
  get cartItemImage() {
    return this.queryAll<HTMLElement>(".cart-menu__item__image > img");
  }
  get cartItemTitle() {
    return this.queryAll<HTMLElement>(".cart-menu__item__info__title");
  }
  get cartItemQuantity() {
    return this.queryAll<HTMLElement>(".cart-menu__item__info__quantity");
  }
  get cartItemPrice() {
    return this.queryAll<HTMLElement>(".cart-menu__item__total-price");
  }
  get cartMenuEmpty() {
    return this.query<HTMLElement>(".cart-menu-empty");
  }
  get cartMenuList() {
    return this.query<HTMLElement>("#cart-menu-list");
  }
}
fdescribe('CartMenuComponent', () => {
  let component: CartMenuComponent;
  let fixture: ComponentFixture<CartMenuComponent>;
  let page: CartMenuPage;
  let store: Store;
  let storeSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartMenuComponent],
      imports: [
        NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartMenuComponent);
    component = fixture.componentInstance;
    page = new CartMenuPage(fixture);
    store = TestBed.get(Store);
    component.cartItems = CartModelMock;
    storeSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  describe('UI Tests', () => {
    it('should populate items in cart when defined', () => {
      expect(page.cartItem.length).toBe(CartModelMock.length);
    })
    it('should render title correctly', () => {
      expect(page.cartItemTitle[0].innerText).toContain(CartModelMock[0].title);
    })
    it('should render quantity', () => {
      expect(page.cartItemQuantity[0].innerText).toContain(CartModelMock[0].quantity + ' pcs');
    })
    it('should render image', () => {
      expect(page.cartItemImage[0].attributes.getNamedItem("src").textContent).toContain(CartModelMock[0].image);
    })
    it('should render total price multiply by quantity', () => {
      expect(page.cartItemPrice[0].innerText).toContain('$ ' + (CartModelMock[0].quantity * CartModelMock[0].price));
    })
    it('should render cart empty when cart is empty', () => {
      component.cartItems = [];
      fixture.detectChanges();
      expect(page.cartMenuList).toBeNull();
    })
    it('should render cart list when cart is not empty', () => {
      component.cartItems = [];
      fixture.detectChanges();
      expect(page.cartMenuEmpty).not.toBeNull();
    })
  })
  describe('Functional Tests', () => {
    it('should dispatch to cart detail page when item cart clicked', () => {
      page.cartItem[0].click();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate({
        commands: ['order']
      }))
    })
  })
});
