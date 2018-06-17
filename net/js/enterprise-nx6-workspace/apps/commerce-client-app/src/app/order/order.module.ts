import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { SharedModule } from '@enterprise/shared/src';
import { PaymentModule } from '../payment/payment.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { CommerceBasketLibModule } from '@enterprise/commerce/basket-lib/src';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommerceBasketLibModule,
    PaymentModule
  ],
  declarations: [OrderComponent, OrderDetailComponent, OrderCompletedComponent]
})
export class OrderModule { }
