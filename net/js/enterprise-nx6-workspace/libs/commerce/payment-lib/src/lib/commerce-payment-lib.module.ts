import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPaymentComponent } from '@enterprise/commerce/payment-lib/src/lib/detail-payment/detail-payment.component';
import { MatCardModule } from '@angular/material';
@NgModule({
  imports: [CommonModule, MatCardModule],
  declarations: [DetailPaymentComponent],
  exports: [DetailPaymentComponent]
})
export class CommercePaymentLibModule { }
