import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from './order-detail.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { Store, NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppState, Logged } from '@enterprise/core/src';
import {
  TdMediaService,
  TdLoadingService,
  TdDialogService
} from '@covalent/core';
import { noop, of } from 'rxjs';
import {
  BasketService,
  CustomerBasketMock,
  BasketState,
  FetchBasket,
  BasketCheckout,
  CheckOutBasket
} from '@enterprise/commerce/basket-lib/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Guid } from '@enterprise/shared/src';
import * as cl from '@enterprise/commerce/catalog-lib';
import { IntegrationEventLogMock } from '../mocks/integration-event-log.mock';
import { OrderState } from '../shared/order.state';
import { IntegrationEventService } from '../../api/api/integrationEvent.service';
import { OrdersService } from '../../api/api/orders.service';

export class OrderDetailPage extends BaseTestPage<OrderDetailComponent> {
  constructor(public fixture: ComponentFixture<OrderDetailComponent>) {
    super(fixture);
  }
  get buyerName() {
    return this.query<HTMLElement>('#buyer-name');
  }
  get buyerCountry() {
    return this.query<HTMLElement>('#buyer-country');
  }
  get buyerCity() {
    return this.query<HTMLElement>('#buyer-city');
  }
  get buyerState() {
    return this.query<HTMLElement>('#buyer-state');
  }
  get buyerZip() {
    return this.query<HTMLElement>('#buyer-zip');
  }
  get buyerStreet() {
    return this.query<HTMLElement>('#buyer-street');
  }
  get buyerPhone() {
    return this.query<HTMLElement>('#buyer-phone');
  }
  get buyerEmail() {
    return this.query<HTMLElement>('#buyer-email');
  }

  get orderListItem() {
    return this.queryAll<HTMLElement>(
      '.order-detail-container__order-list__item'
    );
  }
  get orderListTitle() {
    return this.queryAll<HTMLElement>(
      '.order-detail-container__order-list__item__name'
    );
  }
  get orderListQuantity() {
    return this.queryAll<HTMLElement>(
      '.order-detail-container__order-list__item__quantity'
    );
  }
  get orderListTotalPrice() {
    return this.queryAll<HTMLElement>(
      '.order-detail-container__order-list__item__total-price'
    );
  }
  get orderGrandTotal() {
    return this.query<HTMLElement>(
      '.order-detail-container__order-total > .order-detail-container__order-list__item__total-price'
    );
  }
  get purchaseButton() {
    return this.query<HTMLButtonElement>(
      '.order-detail-container__actions__purchase'
    );
  }
}

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;
  let store: Store;
  let storeSpy: jasmine.Spy;

  let page: OrderDetailPage;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderDetailComponent],
        imports: [
          RouterTestingModule,
          HttpClientModule,
          NgxsModule.forRoot([AppState, BasketState, OrderState])
        ],
        schemas: [NO_ERRORS_SCHEMA],
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
            provide: IntegrationEventService,
            useValue: {
              configuration: {
                accessToken: ''
              },
              byIdGet(id: number) {
                return of(IntegrationEventLogMock);
              }
            }
          },
          {
            provide: cl.IntegrationEventService,
            useValue: {
              configuration: {
                accessToken: ''
              },
              byIdGet(id: number) {
                return of(IntegrationEventLogMock);
              }
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
              },
              apiV1BasketCheckoutPost(basketCheckout: BasketCheckout) {
                return true;
              }
            }
          },
          {
            provide: OrdersService,
            useValue: {
              configuration: {
                accessToken: ''
              }
            }
          },
          {
            provide: MatSnackBar,
            useValue: {
              open(message, count, config) {
                jasmine.createSpy('open');
              }
            }
          }
        ]
      }).compileComponents();
    })
  );
  const userData = {
    profile: {
      name: 'firstname',
      last_name: 'lastname',
      email: 'test@enterprise.com',
      sub: '1231',
      card_holder: 'mock',
      address_country: 'USA',
      address_city: 'Washington',
      address_state: 'WA',
      address_zip_code: 12343,
      address_street: 'street',
      phone_number: 12124214,
      card_number: 2123121241,
      card_expiration: '20/34',
      card_security_number: 123
    }
  };
  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new Logged(userData));
    store.dispatch(new FetchBasket(userData.profile.sub));
    page = new OrderDetailPage(fixture);

    fixture.detectChanges();
  });

  describe('UI Test', () => {
    it('should render correct buyer name', () => {
      expect(page.buyerName.innerHTML).toContain(userData.profile.name);
    });
    it('should render correct buyer country', () => {
      expect(page.buyerCountry.innerHTML).toContain(
        userData.profile.address_country
      );
    });
    it('should render correct buyer city', () => {
      expect(page.buyerCity.innerHTML).toContain(userData.profile.address_city);
    });
    it('should render correct buyer state', () => {
      expect(page.buyerState.innerHTML).toContain(
        userData.profile.address_state
      );
    });
    it('should render correct buyer zip', () => {
      expect(page.buyerZip.innerHTML).toContain(
        userData.profile.address_zip_code + ''
      );
    });
    it('should render correct buyer street', () => {
      expect(page.buyerStreet.innerHTML).toContain(
        userData.profile.address_street
      );
    });
    it('should render correct buyer phone', () => {
      expect(page.buyerPhone.innerHTML).toContain(
        userData.profile.phone_number + ''
      );
    });
    it('should render correct buyer email', () => {
      expect(page.buyerEmail.innerHTML).toContain(userData.profile.email);
    });
    it('should populate order list correctly', () => {
      expect(page.orderListItem.length).toBe(CustomerBasketMock.items.length);
    });
    it('should render correct order name', () => {
      expect(page.orderListTitle[0].innerHTML).toContain(
        CustomerBasketMock.items[0].productName
      );
    });
    it('should render correct order quantity', () => {
      expect(page.orderListQuantity[0].innerHTML).toContain(
        CustomerBasketMock.items[0].quantity + ''
      );
    });
    it('should render correct order total price', () => {
      expect(page.orderListTotalPrice[0].innerHTML).toContain(
        CustomerBasketMock.items[0].unitPrice *
          CustomerBasketMock.items[0].quantity +
          ''
      );
    });
    it('should render correct grand total price', () => {
      expect(page.orderGrandTotal.innerHTML).toContain(
        component.calculateTotalPrice() + ''
      );
    });
  });
  describe('Functional Test', () => {
    it('should dispatch Check out command when purchase button clicked', () => {
      component.ngOnInit();
      page.purchaseButton.click();
      expect(store.dispatch).toHaveBeenCalledWith(
        new CheckOutBasket(component.basketCheckout)
      );
    });
  });
});
