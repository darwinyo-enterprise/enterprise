import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card/product-card.component';
import { MaterialStarsModule } from '@enterprise/material/stars/src';

@NgModule({
  imports: [CommonModule,MaterialStarsModule],
  declarations: [ProductCardComponent]
})
export class CatalogLibModule {}
