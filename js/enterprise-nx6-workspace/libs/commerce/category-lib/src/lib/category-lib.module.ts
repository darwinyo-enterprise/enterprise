import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@enterprise/shared';
import { FileUploadModule } from '@enterprise/material/file-upload';
import { NgxsModule } from '@ngxs/store';
import { CategoryState } from './shared/category.state';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryCardComponent } from './category-card/category-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    NgxsModule.forFeature([CategoryState])
  ],
  declarations: [CategoryFormComponent, CategoryCardComponent],
  exports: [CategoryFormComponent, CategoryCardComponent]
})
export class CategoryLibModule { }
