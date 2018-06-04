import { Routes, RouterModule } from "@angular/router";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { ListCategoryComponent } from "./list-category/list-category.component";
import { EditCategoryComponent } from "./edit-category/edit-category.component";
import { NgModule } from "@angular/core";

export const categoryRoutes: Routes = [
  {
    path: 'category',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'add', component: AddCategoryComponent },
      { path: 'list', component: ListCategoryComponent },
      { path: 'edit/:id', component: EditCategoryComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      categoryRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class CategoryRoutingModule { }