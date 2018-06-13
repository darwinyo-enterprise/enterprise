import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { SharedModule } from '@enterprise/shared/src';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [DetailPaymentComponent],
  exports: [DetailPaymentComponent]
})
export class PaymentModule { }
