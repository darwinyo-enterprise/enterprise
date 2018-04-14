import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxsModule } from '@ngxs/store';
import { ManufacturerState } from './shared/manufacturer.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ManufacturerState])]
})
export class ManufacturerLibModule {}
