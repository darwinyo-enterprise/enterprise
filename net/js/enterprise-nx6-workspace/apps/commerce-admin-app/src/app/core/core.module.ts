import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as cc from '@enterprise/commerce/core';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    cc.CoreModule,
  ],
  declarations: [DashboardComponent],
  exports: [cc.CoreModule,DashboardComponent]
})
export class CoreModule { }
