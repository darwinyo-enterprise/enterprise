import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCartComponent } from './list-cart.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { Store, NgxsModule } from '@ngxs/store';
import { CartModelMock, ClearBasketOldPrice, ClearBasket, FetchBasket, BasketService, CustomerBasketMock, BasketState, DeleteItemBasket, DeleteAllItemBasket, UpdateBasket } from '@enterprise/commerce/basket-lib/src';
import { Navigate, AppState, Logged } from '@enterprise/core/src';
import { of, noop } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TdDialogService, TdLoadingService, TdMediaService } from '@covalent/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    return this.queryAll<HTMLInputElement>(".cart-item__info__quantity__input");
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
    return this.query<HTMLElement>(".cart-item--action");
  }
  get cartItemActionsTotalPrice() {
    return this.cartItemActions.children[0];
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
      declarations: [ListCartComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        NgxsModule.forRoot([AppState, BasketState])],
      providers: [
        {
          provide: TdMediaService,
          useValue: {
            registerQuery: noop,
            query: noop,
            broadcast: noop,
            createComponent: noop,
            createReplaceComponent: noop,
            register: noop,
            resolve: noop
          }
        },
        {
          provide: TdLoadingService,
          useValue: {
            registerQuery: noop,
            query: noop,
            broadcast: noop,
            create: noop,
            createComponent: noop,
            createReplaceComponent: noop,
            register: noop,
            resolve: noop
          }
        },
        {
          provide: TdDialogService,
          useValue: {
            registerQuery: noop,
            query: noop,
            broadcast: noop,
            createComponent: noop,
            createReplaceComponent: noop,
            register: noop,
            resolve: noop
          }
        },
        {
          provide: BasketService,
          useValue: {
            configuration: {
              accessToken: ''
            },
            apiV1BasketByIdGet(id: string) {
              return of(CustomerBasketMock);
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCartComponent);
    component = fixture.componentInstance;
    page = new ListCartPage(fixture);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new Logged(userData));
    component.ngOnInit();
    fixture.detectChanges();
  });
  const userData = {
    profile: {
      name: 'firstname',
      last_name: 'lastname',
      email: 'test@enterprise.com',
      sub: '1231'
    }
  }
  describe('UI Tests', () => {
    it('should render old price when basket item has old price', () => {
      component.cartItems = component.cartItems.map(x => { x.oldUnitPrice = 12; return x });
      fixture.detectChanges();
      expect(page.cartItemOldPrice[0].innerHTML).toContain('$ ' + CartModelMock[0].oldUnitPrice);
    })
    it('should render title info when basket item has old price', () => {
      component.cartItems = component.cartItems.map(x => { x.oldUnitPrice = 12; return x });
      fixture.detectChanges();
      expect(page.cartItemTitleInfo.length).toBe(CartModelMock.length);
    })
    it('should display order total price', () => {
      const totalPrice = CartModelMock.map((v, i) => {
        return v.quantity * v.unitPrice;
      }).reduce((p, c, i) => p + c);
      expect(page.cartItemActionsTotalPrice.innerHTML).toContain('$ ' + totalPrice)
    })
    it('should populate items in cart when defined', () => {
      expect(page.cartItem.length - 1).toBe(CartModelMock.length);
    })
    it('should render title correctly', () => {
      expect(page.cartItemTitle[0].innerText).toContain(CartModelMock[0].productName);
    })
    it('should render quantity', () => {
      const comp = component.cartItems;
      fixture.detectChanges();
      expect(page.cartItemQuantity[0].value).toContain(CartModelMock[0].quantity + '');
    })
    it('should render image', () => {
      expect(page.cartItemImages[0].attributes.getNamedItem("src").textContent).toContain(CartModelMock[0].pictureUrl);
    })
    it('should render total price multiply by quantity', () => {
      expect(page.cartItemTotalPrice[0].innerText).toContain('$ ' + (CartModelMock[0].quantity * CartModelMock[0].unitPrice));
    })
    it('should hide old price when cart doesnt have old price', () => {
      store.dispatch(ClearBasketOldPrice);
      fixture.detectChanges();
      expect(page.cartItemOldPrice.length).toBe(0);
    })
    it('should hide title info when cart doesnt have old price', () => {
      store.dispatch(ClearBasketOldPrice);
      fixture.detectChanges();
      expect(page.cartItemTitleInfo.length).toBe(0);
    })
  })
  describe('Functional Tests', () => {
    it('should map correct anchor in title', () => {
      expect(page.cartItemTitle[0].attributes.getNamedItem("href").textContent).toContain('/product-detail/' + CartModelMock[0].productId);
    })
    it('should dispatch FetchBasket on init when user Authenticated', () => {
      let data: any;
      component.customerData$.subscribe((user) => data = user);
      expect(store.dispatch).toHaveBeenCalledWith(new FetchBasket(data.profile.sub))
    })
    it('should dispatch delete item basket when delete btn clicked', () => {
      const id: string = CartModelMock[0].productId;
      page.cartItemDelete[0].click()
      expect(store.dispatch).toHaveBeenCalledWith(new DeleteItemBasket(id));
    })
    it('should dispatch delete all basket when clear all btn clicked', () => {
      page.cartItemClearBtn.click();
      expect(store.dispatch).toHaveBeenCalledWith(DeleteAllItemBasket);
    })
    it('should dispatch update basket when check out clicked', () => {
      page.cartItemPurchaseBtn.click();
      expect(store.dispatch).toHaveBeenCalledWith(UpdateBasket);
    })
  })
});
