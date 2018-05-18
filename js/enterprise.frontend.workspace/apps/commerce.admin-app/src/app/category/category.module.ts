import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCategoryComponent } from './add-category/add-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';

import { CategoryLibModule } from '@enterprise/commerce/category-lib';
import { ListItemActionsModule } from '@enterprise/material/list-item-actions';
import { NgxsModule } from '@ngxs/store';
import { CategoryRoutingModule } from './category-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CategoryRoutingModule,
    CategoryLibModule,
    ListItemActionsModule
  ],
  declarations: [
    AddCategoryComponent,
    ListCategoryComponent,
    EditCategoryComponent
  ],
  exports: [
    AddCategoryComponent,
    ListCategoryComponent,
    EditCategoryComponent
  ]
})
export class CategoryModule { }
