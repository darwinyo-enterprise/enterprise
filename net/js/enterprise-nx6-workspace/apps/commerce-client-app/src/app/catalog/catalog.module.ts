import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCatalogComponent } from './list-catalog/list-catalog.component';
import { DetailCatalogComponent } from './detail-catalog/detail-catalog.component';
import { MaterialGalleryModule } from '@enterprise/material/gallery';
import { MaterialStarsModule } from '@enterprise/material/stars/src';
import { SharedModule } from '@enterprise/shared/src';
import { MaterialCounterModule } from '@enterprise/material/counter/src';

@NgModule({
  imports: [
    CommonModule, MaterialGalleryModule, MaterialStarsModule,
    SharedModule, MaterialCounterModule
  ],
  declarations: [ListCatalogComponent, DetailCatalogComponent],
  exports: [ListCatalogComponent, DetailCatalogComponent]
})
export class CatalogModule { }
