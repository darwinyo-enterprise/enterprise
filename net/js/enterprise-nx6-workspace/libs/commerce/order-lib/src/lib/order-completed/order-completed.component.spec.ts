import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompletedComponent } from './order-completed.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as cl from '@enterprise/commerce/catalog-lib';
import { IntegrationEventLogMock } from '../mocks/integration-event-log.mock';
import { of } from 'rxjs';
import { Navigate } from '@enterprise/core/src';
import { IntegrationEventService } from '../../api/api/integrationEvent.service';
import { OrderState } from '../shared/order.state';
import { OrdersService } from '../../api/api/orders.service';
import { UpdateOrderStatus } from '../shared/order.action';

export class OrderCompletedPage extends BaseTestPage<OrderCompletedComponent> {
  constructor(public fixture: ComponentFixture<OrderCompletedComponent>) {
    super(fixture);
  }
  get orderTrackerItem() {
    return this.queryAll<HTMLElement>(
      '.order-completed-container__content__item'
    );
  }
  get orderTrackerStatus() {
    return this.queryAll<HTMLElement>(
      '.order-completed-container__content__item__status'
    );
  }
  get orderTrackerDate() {
    return this.queryAll<HTMLElement>(
      '.order-completed-container__content__item__date'
    );
  }
  get backToHomeBtn() {
    return this.query<HTMLButtonElement>(
      '.order-completed-container__actions__back'
    );
  }
}
describe('OrderCompletedComponent', () => {
  let component: OrderCompletedComponent;
  let fixture: ComponentFixture<OrderCompletedComponent>;
  let page: OrderCompletedPage;
  let store: Store;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderCompletedComponent],
        imports: [HttpClientModule, NgxsModule.forRoot([OrderState])],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
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

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCompletedComponent);
    component = fixture.componentInstance;
    page = new OrderCompletedPage(fixture);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new UpdateOrderStatus(1, 'none'));
    fixture.detectChanges();
  });

  describe('UI Test', () => {
    it('should render populate correct tracker', () => {
      expect(page.orderTrackerItem.length).toBe(IntegrationEventLogMock.length);
    });
    it('should render correct status', () => {
      expect(page.orderTrackerStatus[0].innerHTML).toContain(
        IntegrationEventLogMock[0].orderStatus
      );
    });
    it('should render correct date', () => {
      expect(page.orderTrackerDate[0].innerHTML).toContain(
        component.convertToLocaleFormat(IntegrationEventLogMock[0].creationTime)
      );
    });
  });
  describe('Functional test', () => {
    it('should dispatch navigate to home when return to home clicked', () => {
      page.backToHomeBtn.click();
      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate({
          commands: ['home']
        })
      );
    });
  });
});
