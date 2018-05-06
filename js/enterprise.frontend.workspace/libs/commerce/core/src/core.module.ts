import { NgModule } from '@angular/core';
import { ManufacturerService } from '@enterprise/commerce/catalog-lib';
import * as core from '@enterprise/core';
@NgModule({
  imports: [core.CoreModule],
  providers: [ManufacturerService]
})
export class CoreModule { }
