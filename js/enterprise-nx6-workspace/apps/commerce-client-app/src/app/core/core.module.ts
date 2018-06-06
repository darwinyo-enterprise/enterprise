import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as cc from '@enterprise/commerce/core';
import * as ci from '@enterprise/commerce/catalog-lib';
import { HomeComponent } from './home/home.component';
import { ProductLibModule } from '@enterprise/commerce/product-lib/src';

@NgModule({
  imports: [
    CommonModule,
    cc.CoreModule,
    ci.ApiModule,
    ProductLibModule
  ],
  declarations: [HomeComponent],
  exports: [cc.CoreModule,
    ProductLibModule]
})
export class CoreModule { }
