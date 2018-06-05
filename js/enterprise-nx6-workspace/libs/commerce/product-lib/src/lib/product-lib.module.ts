import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@enterprise/shared';

import { NgxsModule } from '@ngxs/store';
import { ProductState } from './shared/product.state';
import { ProductFormComponent } from './product-form/product-form.component';
import { FileUploadModule } from '@enterprise/material/file-upload';
import { ProductCardComponent } from '@enterprise/commerce/product-lib/src/lib/product-card/product-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    NgxsModule.forFeature([ProductState])
  ],
  declarations: [ProductFormComponent,ProductCardComponent],
  exports: [ProductFormComponent,ProductCardComponent]
})
export class ProductLibModule { }
