import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxsModule } from '@ngxs/store';
import { ManufacturerState } from './shared/manufacturer.state';
import { ManufacturerFormComponent } from './manufacturer-form/manufacturer-form.component';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ManufacturerState])],
  declarations: [ManufacturerFormComponent]
})
export class ManufacturerLibModule {}
