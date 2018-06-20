import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { MatCardModule } from '@angular/material';
import { SharedModule } from '@enterprise/shared/src';
import { NgxsModule } from '@ngxs/store';
@NgModule({
  imports: [CommonModule, MatCardModule, SharedModule],
  declarations: [DetailPaymentComponent],
  exports: [DetailPaymentComponent]
})
export class CommercePaymentLibModule { }
