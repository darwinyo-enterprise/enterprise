import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { SharedModule } from '@enterprise/shared/src';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderCompletedComponent } from './order-completed/order-completed.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CartModule,
    PaymentModule
  ],
  declarations: [OrderComponent, OrderDetailComponent, OrderCompletedComponent]
})
export class OrderModule { }
