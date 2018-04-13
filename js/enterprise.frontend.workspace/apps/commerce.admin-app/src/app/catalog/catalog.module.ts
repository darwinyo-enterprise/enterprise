import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';

@NgModule({
  imports: [
    CommonModule,
    ProductModule,
    CategoryModule,
    ManufacturerModule
  ],
  declarations: []
})
export class CatalogModule { }
