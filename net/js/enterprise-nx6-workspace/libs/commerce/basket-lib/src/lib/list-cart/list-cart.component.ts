import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { FetchBasket, DeleteItemBasket, DeleteAllItemBasket, UpdateBasket } from '../shared/basket.action';
import { Observable } from 'rxjs/Observable';
import { AppState } from '@enterprise/core/src';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BasketState } from '../shared/basket.state';
import { BasketItem } from '../../api/model/basketItem';

@Component({
  selector: 'eca-list-cart',
  templateUrl: './list-cart.component.html',
  styleUrls: ['./list-cart.component.scss']
})
export class ListCartComponent implements OnInit, OnDestroy {
  @Select(BasketState.getBasketItems)
  cartItems$: Observable<BasketItem[]>;

  cartItems: BasketItem[];

  @Select(AppState.userData)
  customerData$: Observable<any>;

  unsubscribe$: ReplaySubject<boolean>;

  constructor(private store: Store) {
    this.unsubscribe$ = new ReplaySubject(1);
  }

  ngOnInit() {
    this.customerData$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data !== null) {
          this.store.dispatch(new FetchBasket(data.profile.sub));
        }
      })
    this.cartItems$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data !== null) {
          this.cartItems = data;
        }
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
  }
  calculateTotalPrice() {
    if (this.cartItems.length > 0) {
      return this.cartItems.map((v, i) => v.quantity * v.unitPrice).reduce((p, c) => p + c);
    }
  }
  onDelete(id: string) {
    this.store.dispatch(new DeleteItemBasket(id));
  }
  onClearBasketClicked() {
    this.store.dispatch(DeleteAllItemBasket);
  }
  onPurchaseBtnClicked() {
    this.store.dispatch(UpdateBasket);
  }
}
