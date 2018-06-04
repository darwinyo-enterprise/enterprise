import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductLibModule } from '@enterprise/commerce/product-lib';
import { ListItemActionsModule } from '@enterprise/material/list-item-actions';
import { AddProductComponent } from './add-product/add-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    ProductLibModule,
    ListItemActionsModule
  ],
  declarations: [
    AddProductComponent,
    ListProductComponent,
    EditProductComponent
  ],
  exports: [
    AddProductComponent,
    ListProductComponent,
    EditProductComponent
  ]
})
export class ProductModule {}
