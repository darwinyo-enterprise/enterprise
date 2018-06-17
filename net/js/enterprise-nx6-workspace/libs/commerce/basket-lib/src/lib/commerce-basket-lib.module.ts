import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartMenuComponent } from './cart-menu/cart-menu.component';
import { SharedModule } from '@enterprise/shared/src';
import { ListCartComponent } from './list-cart/list-cart.component';
import { BasketState } from './shared/basket.state';
import { NgxsModule } from '@ngxs/store';
import { ApiModule } from '../api/api.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [CommonModule, SharedModule,
    NgxsModule.forFeature([BasketState]),
    ApiModule, FormsModule, RouterModule],
  declarations: [CartMenuComponent, ListCartComponent],
  exports: [CartMenuComponent, ListCartComponent, ApiModule]
})
export class CommerceBasketLibModule { }
