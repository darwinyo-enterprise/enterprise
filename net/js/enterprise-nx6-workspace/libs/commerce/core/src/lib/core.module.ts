import { NgModule } from '@angular/core';
import * as core from '@enterprise/core';
import * as ca from '@enterprise/commerce/catalog-lib';
@NgModule({
  imports: [core.CoreModule, ca.ApiModule],
  providers: [],
  exports: [core.CoreModule, ca.ApiModule]
})
export class CoreModule { }
