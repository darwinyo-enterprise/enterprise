import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarComponent } from './star/star.component';
import { StarContainerComponent } from './star-container/star-container.component';
@NgModule({
  imports: [CommonModule],
  declarations: [StarComponent, StarContainerComponent],
  exports: [StarComponent, StarContainerComponent]
})
export class MaterialStarsModule { }
