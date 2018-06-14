import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@enterprise/core/src';
import { CartModel } from '../models/cart.model';


@Component({
  selector: 'eca-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss']
})
export class CartMenuComponent implements OnInit {
  @Input()
  cartItems: CartModel[];

  constructor(private store: Store) { }

  ngOnInit() {
  }

  onCartItemClicked() {
    this.store.dispatch(new Navigate({
      commands: ['order']
    }))
  }
}
