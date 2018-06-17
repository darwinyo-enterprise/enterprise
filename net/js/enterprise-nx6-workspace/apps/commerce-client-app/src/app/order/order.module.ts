import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { SharedModule } from '@enterprise/shared/src';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { CommerceBasketLibModule } from '@enterprise/commerce/basket-lib/src';
import { CommercePaymentLibModule } from '@enterprise/commerce/payment-lib/src';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommerceBasketLibModule,
    CommercePaymentLibModule
  ],
  declarations: [OrderComponent, OrderDetailComponent, OrderCompletedComponent]
})
export class OrderModule { }
