import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '@enterprise/core/src';
import { BasketItem } from '../../api/model/basketItem';
import {
  BasketState,
  BasketCheckout,
  CheckOutBasket
} from '@enterprise/commerce/basket-lib/src';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'eca-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  @Select(AppState.userData) userData$: Observable<any>;

  userData: any;

  @Select(BasketState.getBasketItems) orderList$: Observable<BasketItem[]>;

  orderList: BasketItem[];

  unsubscribe$: ReplaySubject<boolean>;
  basketCheckout: BasketCheckout;
  constructor(private store: Store) {
    this.unsubscribe$ = new ReplaySubject(1);
  }

  ngOnInit() {
    this.userData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(x => (this.userData = x));
    this.orderList$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(x => (this.orderList = x));

    const dateExpirationStr: string = this.userData.profile.card_expiration;
    const dtArr = dateExpirationStr.split('/');

    this.basketCheckout = {
      buyer: this.userData.profile.name,
      city: this.userData.profile.address_city,
      street: this.userData.profile.address_street,
      state: this.userData.profile.address_state,
      country: this.userData.profile.address_country,
      zipCode: this.userData.profile.address_zip_code,
      cardNumber: this.userData.profile.card_number,
      cardHolderName: this.userData.profile.card_holder,
      cardExpiration: new Date(2000 + +dtArr[1], +dtArr[0]),
      cardSecurityNumber: this.userData.profile.card_security_number + '',
      cardTypeId: 1
    };
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
  }
  calculateTotalPrice() {
    if (this.orderList.length > 0) {
      return this.orderList
        .map((v, i) => v.quantity * v.unitPrice)
        .reduce((p, c) => p + c);
    }
  }
  onPurchaseClicked() {
    this.store.dispatch(new CheckOutBasket(this.basketCheckout));
  }
}
