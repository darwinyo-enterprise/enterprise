import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule } from '../api/api.module';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MatCardModule } from '@angular/material';
import { SharedModule } from '@enterprise/shared/src';
import { NgxsModule } from '@ngxs/store';
import { OrderState } from './shared/order.state';
import { BasketState } from '@enterprise/commerce/basket-lib/src';
@NgModule({
  imports: [CommonModule, ApiModule, MatCardModule, SharedModule, NgxsModule.forFeature([OrderState])],
  declarations: [OrderCompletedComponent, OrderDetailComponent],
  exports: [ApiModule, OrderCompletedComponent, OrderDetailComponent]
})
export class CommerceOrderLibModule { }
