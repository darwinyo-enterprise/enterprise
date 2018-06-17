import { Component, OnInit, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Navigate, AppState } from '@enterprise/core/src';
import { BasketItem } from '../../api/model/basketItem';
import { ReplaySubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FetchBasket } from '@enterprise/commerce/basket-lib/src/lib/shared/basket.action';
import { BasketState } from '@enterprise/commerce/basket-lib/src/lib/shared/basket.state';


@Component({
  selector: 'em-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss']
})
export class CartMenuComponent implements OnInit {
  @Select(BasketState.getBasketItems)
  cartItems$: Observable<BasketItem[]>;

  @Select(AppState.userData)
  customerData$: Observable<any>;

  unsubscribe$: ReplaySubject<boolean>;

  constructor(private store: Store) {
    this.unsubscribe$ = new ReplaySubject(1);
  }

  ngOnInit() {
    this.customerData$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      if (data !== null) {
        this.store.dispatch(new FetchBasket(data.profile.sub));
      }
    })
  }

  onCartItemClicked() {
    this.store.dispatch(new Navigate({
      commands: ['order']
    }))
  }
}
