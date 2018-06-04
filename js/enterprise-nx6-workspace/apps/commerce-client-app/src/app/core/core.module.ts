import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as cc from '@enterprise/commerce/core';
import * as ci from '@enterprise/commerce/catalog-lib';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    cc.CoreModule,
    ci.ApiModule
  ],
  declarations: [HomeComponent],
  exports: [cc.CoreModule]
})
export class CoreModule { }
