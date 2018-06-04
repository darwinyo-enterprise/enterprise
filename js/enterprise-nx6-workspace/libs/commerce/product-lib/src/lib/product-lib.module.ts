import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@enterprise/shared';

import { NgxsModule } from '@ngxs/store';
import { ProductState } from './shared/product.state';
import { ProductFormComponent } from './product-form/product-form.component';
import { FileUploadModule } from '@enterprise/material/file-upload';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    NgxsModule.forFeature([ProductState])
  ],
  declarations: [ProductFormComponent],
  exports: [ProductFormComponent]
})
export class ProductLibModule { }
