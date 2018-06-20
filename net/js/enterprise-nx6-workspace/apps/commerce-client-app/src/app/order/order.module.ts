import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { SharedModule } from '@enterprise/shared/src';
import { CommerceBasketLibModule } from '@enterprise/commerce/basket-lib/src';
import { CommercePaymentLibModule } from '@enterprise/commerce/payment-lib/src';
import { CommerceOrderLibModule } from '@enterprise/commerce/order-lib/src';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommerceBasketLibModule,
    CommercePaymentLibModule,
    CommerceOrderLibModule
  ],
  declarations: [OrderComponent]
})
export class OrderModule { }
