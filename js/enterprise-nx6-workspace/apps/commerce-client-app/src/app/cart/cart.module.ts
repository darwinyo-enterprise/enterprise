import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCartComponent } from './list-cart/list-cart.component';
import { CartMenuComponent } from './cart-menu/cart-menu.component';
import { SharedModule } from '@enterprise/shared/src';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ListCartComponent, CartMenuComponent],
  exports: [CartMenuComponent, ListCartComponent]
})
export class CartModule { }
