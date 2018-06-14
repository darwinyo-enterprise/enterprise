import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as cc from '@enterprise/commerce/core';
import * as ci from '@enterprise/commerce/catalog-lib';
import { HomeComponent } from './home/home.component';
import { ProductLibModule } from '@enterprise/commerce/product-lib/src';
import { ManufacturerLibModule } from '@enterprise/commerce/manufacturer-lib/src';
import { CategoryLibModule } from '@enterprise/commerce/category-lib/src';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    cc.CoreModule,
    ci.ApiModule,
    ProductLibModule,
    ManufacturerLibModule,
    CategoryLibModule
  ],
  declarations: [HomeComponent],
  exports: [cc.CoreModule,
    ProductLibModule,
    ManufacturerLibModule,
    CategoryLibModule]
})
export class CoreModule { }
