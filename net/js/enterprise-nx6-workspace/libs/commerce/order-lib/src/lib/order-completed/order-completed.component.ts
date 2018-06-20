import { Component, OnInit } from '@angular/core';
import { IntegrationEventLogEntry } from '../../api/model/integrationEventLogEntry';
import { OrderState } from '../shared/order.state';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@enterprise/core/src';

@Component({
  selector: 'eca-order-completed',
  templateUrl: './order-completed.component.html',
  styleUrls: ['./order-completed.component.scss']
})
export class OrderCompletedComponent implements OnInit {
  @Select(OrderState.getOrderTracks) orderTracks$: IntegrationEventLogEntry[];

  constructor(private store: Store) {}

  ngOnInit() {}
  convertToLocaleFormat(date: Date) {
    return new Date(date).toLocaleString();
  }
  onBackToHomeClicked() {
    this.store.dispatch(
      new Navigate({
        commands: ['home']
      })
    );
  }
}
