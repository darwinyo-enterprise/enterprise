import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCartComponent } from './list-cart.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { Store } from '@ngxs/store';
import { CartModelMock, ClearBasketOldPrice, ClearBasket, FetchBasket } from '@enterprise/commerce/basket-lib/src';
import { Navigate } from '@enterprise/core/src';

export class ListCartPage extends BaseTestPage<ListCartComponent> {
  constructor(public fixture: ComponentFixture<ListCartComponent>) {
    super(fixture);
  }
  get cartItemContainer() {
    return this.query<HTMLElement>(".cart-item__container");
  }
  get cartItem() {
    return this.queryAll<HTMLElement>(".cart-item__container__child");
  }
  get cartItemImages() {
    return this.queryAll<HTMLElement>(".cart-item__image > img");
  }
  get cartItemTitle() {
    return this.queryAll<HTMLElement>(".cart-item__info__title > a");
  }
  get cartItemTitleInfo() {
    return this.queryAll<HTMLElement>(".cart-item__info__title__info");
  }
  get cartItemQuantity() {
    return this.queryAll<HTMLElement>(".cart-item__info__quantity__input");
  }
  get cartItemOldPrice() {
    return this.queryAll<HTMLElement>(".cart-item__info__quantity__old-price");
  }
  get cartItemUnitPrice() {
    return this.queryAll<HTMLElement>(".cart-item__info__quantity__price");
  }
  get cartItemTotalPrice() {
    return this.queryAll<HTMLElement>(".cart-item__total-price");
  }
  get cartItemDelete() {
    return this.queryAll<HTMLButtonElement>(".cart-item__delete-btn");
  }
  get cartItemActions() {
    return this.cartItem[this.cartItem.length];
  }
  get cartItemActionsTotalPrice() {
    return this.cartItemActions.children[0].children[0];
  }
  get cartItemPurchaseBtn() {
    return this.query<HTMLButtonElement>(".cart-item-action__purchase-btn");
  }
  get cartItemClearBtn() {
    return this.query<HTMLButtonElement>(".cart-item-action__clear-btn");
  }
}

describe('ListCartComponent', () => {
  let component: ListCartComponent;
  let fixture: ComponentFixture<ListCartComponent>;
  let store: Store;
  let storeSpy: jasmine.Spy;
  let page: ListCartPage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI Tests', () => {
    it('should populate items in cart when defined', () => {
      expect(page.cartItem.length).toBe(CartModelMock.length);
    })
    it('should render title correctly', () => {
      expect(page.cartItemTitle[0].innerText).toContain(CartModelMock[0].productName);
    })
    it('should render quantity', () => {
      expect(page.cartItemQuantity[0].innerText).toContain(CartModelMock[0].quantity + ' pcs');
    })
    it('should render image', () => {
      expect(page.cartItemImages[0].attributes.getNamedItem("src").textContent).toContain(CartModelMock[0].pictureUrl);
    })
    it('should render total price multiply by quantity', () => {
      expect(page.cartItemTotalPrice[0].innerText).toContain('$ ' + (CartModelMock[0].quantity * CartModelMock[0].unitPrice));
    })
    it('should render old price when basket item has old price', () => {
      expect(page.cartItemOldPrice[0].innerHTML).toContain('$ ' + CartModelMock[0].oldUnitPrice);
    })
    it('should hide old price when cart doesnt have old price', () => {
      store.dispatch(ClearBasketOldPrice);
      fixture.detectChanges();
      expect(page.cartItemOldPrice.length).toBe(0);
    })
    it('should render title info when basket item has old price', () => {
      expect(page.cartItemTitleInfo.length).toBe(CartModelMock.length);
    })
    it('should hide title info when cart doesnt have old price', () => {
      store.dispatch(ClearBasketOldPrice);
      fixture.detectChanges();
      expect(page.cartItemTitleInfo.length).toBe(0);
    })
    it('should display order total price', () => {
      const totalPrice = CartModelMock.map((v, i) => {
        return v.quantity * v.unitPrice;
      }).reduce((p, c, i) => p + c);
      expect(page.cartItemActionsTotalPrice.innerHTML).toContain('$ ' + totalPrice)
    })
  })
  describe('Functional Tests', () => {
    it('should dispatch to cart detail page when item cart clicked', () => {
      page.cartItem[0].click();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate({
        commands: ['order']
      }))
    })
    it('should dispatch FetchBasket on init when user Authenticated', () => {
      let data: any;
      component.customerData$.subscribe((user) => data = user);
      expect(store.dispatch).toHaveBeenCalledWith(new FetchBasket(data.profile.sub))
    })

  })
});
