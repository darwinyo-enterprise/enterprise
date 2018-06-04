import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCatalogComponent } from './list-catalog/list-catalog.component';
import { DetailCatalogComponent } from './detail-catalog/detail-catalog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ListCatalogComponent, DetailCatalogComponent]
})
export class CatalogModule { }
