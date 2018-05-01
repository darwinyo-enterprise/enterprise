import { NgModule } from '@angular/core';
import { ManufacturerService } from '@enterprise/commerce/catalog-lib';

import * as ec from '@enterprise/core';

@NgModule({
  imports: [ec.CoreModule],
  exports: [ec.CoreModule],
  providers: [ManufacturerService]
})
export class CoreModule {}
