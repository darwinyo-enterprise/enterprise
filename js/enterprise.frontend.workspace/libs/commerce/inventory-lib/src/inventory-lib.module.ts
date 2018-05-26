import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@enterprise/shared';

import { NgxsModule } from '@ngxs/store';
import { InventoryState } from './shared/inventory.state';
import { FileUploadModule } from '@enterprise/material/file-upload';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    NgxsModule.forFeature([InventoryState])
  ],
  declarations: [],
  exports: []
})
export class InventoryLibModule { }
