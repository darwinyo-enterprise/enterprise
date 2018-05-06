import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { ListManufacturerComponent } from './list-manufacturer/list-manufacturer.component';
import { EditManufacturerComponent } from './edit-manufacturer/edit-manufacturer.component';

import { ManufacturerLibModule } from '@enterprise/commerce/manufacturer-lib';
import { ListItemActionsModule } from '@enterprise/material/list-item-actions';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, ManufacturerLibModule, ListItemActionsModule],
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
