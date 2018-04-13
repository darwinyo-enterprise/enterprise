import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@enterprise/shared';

import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { ListManufacturerComponent } from './list-manufacturer/list-manufacturer.component';
import { EditManufacturerComponent } from '../manufacturer/edit-manufacturer/edit-manufacturer.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    AddManufacturerComponent,
    ListManufacturerComponent,
    EditManufacturerComponent
  ],
  exports: [
    AddManufacturerComponent,
    ListManufacturerComponent,
    EditManufacturerComponent
  ]
})
export class ManufacturerModule { }
