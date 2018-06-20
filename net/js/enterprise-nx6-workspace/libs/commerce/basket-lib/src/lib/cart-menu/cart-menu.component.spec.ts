import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartMenuComponent } from './cart-menu.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { Store, NgxsModule } from '@ngxs/store';
import { RouterState, Navigate, AppState, Logged } from '@enterprise/core/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartModelMock, CustomerBasketMock } from '../mocks/cart-model.mock';
import { TdLoadingService, TdMediaService, TdDialogService } from '@covalent/core';
import { noop, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BasketState } from '../shared/basket.state';
import { ClearBasketOldPrice, ClearBasket, FetchBasket } from '../shared/basket.action';
import { BasketService } from '../../api/api/basket.service';
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
  get cartItemOldPrice() {
    return this.queryAll<HTMLElement>(".cart-menu__item__old-price");
  }
  get cartMenuEmpty() {
    return this.query<HTMLElement>(".cart-menu-empty");
  }
  get cartMenuList() {
    return this.query<HTMLElement>("#cart-menu-list");
  }
}
describe('CartMenuComponent', () => {
  let component: CartMenuComponent;
  let fixture: ComponentFixture<CartMenuComponent>;
  let page: CartMenuPage;
  let store: Store;
  let storeSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartMenuComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
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
    fixture = TestBed.createComponent(CartMenuComponent);
    component = fixture.componentInstance;
    page = new CartMenuPage(fixture);
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
      expect(page.cartItemImage[0].attributes.getNamedItem("src").textContent).toContain(CartModelMock[0].pictureUrl);
    })
    it('should render total price multiply by quantity', () => {
      expect(page.cartItemPrice[0].innerText).toContain('$ ' + (CartModelMock[0].quantity * CartModelMock[0].unitPrice));
    })
    it('should render old price when basket item has old price', () => {
      expect(page.cartItemOldPrice[0].innerHTML).toContain('$ ' + CartModelMock[0].oldUnitPrice);
    })
    it('should hide old price when cart doesnt have old price', () => {
      store.dispatch(ClearBasketOldPrice);
      fixture.detectChanges();
      expect(page.cartItemOldPrice.length).toBe(0);
    })
    it('should render cart empty when cart is empty', () => {
      store.dispatch(ClearBasket);
      fixture.detectChanges();
      expect(page.cartMenuList).toBeNull();
    })
    it('should render cart list when cart is not empty', () => {
      store.dispatch(ClearBasket);
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
    it('should dispatch FetchBasket on init when user Authenticated', () => {
      let data: any;
      component.customerData$.subscribe((user) => data = user);
      expect(store.dispatch).toHaveBeenCalledWith(new FetchBasket(data.profile.sub))
    })

  })
});
