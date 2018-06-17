import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaymentComponent } from './detail-payment.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { Store, NgxsModule } from '@ngxs/store';
import { AppState, Logged } from '@enterprise/core/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TdDialogService, TdLoadingService, TdMediaService } from '@covalent/core';
import { noop } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

export class DetailPaymentPage extends BaseTestPage<DetailPaymentComponent> {
  constructor(public fixture: ComponentFixture<DetailPaymentComponent>) {
    super(fixture);
  }
  get paymentDetailCardNumber() {
    return this.query<HTMLElement>(".payment-detail__card-number");
  }
  get paymentDetailCardHolder() {
    return this.query<HTMLElement>(".payment-detail__card-holder");
  }
  get paymentDetailCardExpiry() {
    return this.query<HTMLElement>(".payment-detail__card-expiry");
  }
  get paymentDetailCardSecurity() {
    return this.query<HTMLElement>(".payment-detail__card-security");
  }

}
describe('DetailPaymentComponent', () => {
  let component: DetailPaymentComponent;
  let fixture: ComponentFixture<DetailPaymentComponent>;
  let page: DetailPaymentPage;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailPaymentComponent],
      imports: [NgxsModule.forRoot([AppState]), HttpClientModule, RouterTestingModule],
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
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));
  const userData = {
    profile: {
      name: 'firstname',
      last_name: 'lastname',
      email: 'test@enterprise.com',
      sub: '1231',
      card_number: 2123121241,
      card_holder: 'mcok',
      card_expiration: '12/23',
      card_security_number: 123
    }
  }
  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPaymentComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    page = new DetailPaymentPage(fixture);
    store.dispatch(new Logged(userData));
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('UI Test', () => {
    it('should render correct card number', () => {
      expect(page.paymentDetailCardNumber.innerHTML).toContain(userData.profile.card_number + '');
    })
    it('should render correct card holder', () => {
      expect(page.paymentDetailCardHolder.innerHTML).toContain(userData.profile.card_holder + '');
    })
    it('should render correct card expiry', () => {
      expect(page.paymentDetailCardExpiry.innerHTML).toContain(userData.profile.card_expiration + '');
    })
    it('should render correct card security', () => {
      expect(page.paymentDetailCardSecurity.innerHTML).toContain(userData.profile.card_security_number + '');
    })
  })
});
