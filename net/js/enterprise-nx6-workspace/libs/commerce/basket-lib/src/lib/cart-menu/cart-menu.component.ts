import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@enterprise/core/src';
import { BasketItem } from '@enterprise/commerce/basket-lib/src';


@Component({
  selector: 'em-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss']
})
export class CartMenuComponent implements OnInit {
  @Input()
  cartItems: BasketItem[];

  constructor(private store: Store) { }

  ngOnInit() {
  }

  onCartItemClicked() {
    this.store.dispatch(new Navigate({
      commands: ['order']
    }))
  }
}
