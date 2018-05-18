import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as cc from '@enterprise/commerce/core';
import * as ci from '@enterprise/commerce/catalog-lib';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    cc.CoreModule,
    ci.ApiModule
  ],
  declarations: [DashboardComponent],
  exports: [cc.CoreModule,DashboardComponent]
})
export class CoreModule { }
