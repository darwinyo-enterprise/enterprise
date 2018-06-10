
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryContainerComponent } from './gallery-container/gallery-container.component';
import { NgxsModule } from '@ngxs/store';
import { GalleryState } from './shared/gallery.state';
import { MatCardModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([GalleryState]),
    MatCardModule
  ],
  declarations: [GalleryContainerComponent],
  exports: [GalleryContainerComponent],
})
export class MaterialGalleryModule { }
