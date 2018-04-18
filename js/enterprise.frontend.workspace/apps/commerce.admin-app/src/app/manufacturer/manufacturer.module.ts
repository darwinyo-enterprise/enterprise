import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@enterprise/shared';

import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { ListManufacturerComponent } from './list-manufacturer/list-manufacturer.component';
import { EditManufacturerComponent } from '../manufacturer/edit-manufacturer/edit-manufacturer.component';
import { ManufacturerLibModule } from '@enterprise/commerce/manufacturer-lib';
import { FileUploadModule } from '@enterprise/material/file-upload';

@NgModule({
  imports: [CommonModule, SharedModule, ManufacturerLibModule, FileUploadModule],
  declarations: [
    AddManufacturerComponent,
    ListManufacturerComponent,
    EditManufacturerComponent
  ],
  exports: [
    FileUploadModule,
    AddManufacturerComponent,
    ListManufacturerComponent,
    EditManufacturerComponent
  ]
})
export class ManufacturerModule { }
