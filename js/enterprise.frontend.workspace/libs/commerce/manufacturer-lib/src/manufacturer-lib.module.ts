import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@enterprise/shared';

import { NgxsModule } from '@ngxs/store';
import { ManufacturerState } from './shared/manufacturer.state';
import { ManufacturerFormComponent } from './manufacturer-form/manufacturer-form.component';
import { FileUploadModule } from '@enterprise/material/file-upload';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    NgxsModule.forFeature([ManufacturerState])
  ],
  declarations: [ManufacturerFormComponent],
  exports: [ManufacturerFormComponent]
})
export class ManufacturerLibModule { }
