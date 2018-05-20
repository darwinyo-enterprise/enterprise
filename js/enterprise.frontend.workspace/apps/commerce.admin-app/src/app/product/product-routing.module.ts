import { Routes, RouterModule } from "@angular/router";
import { AddProductComponent } from "./add-product/add-product.component";
import { ListProductComponent } from "./list-product/list-product.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { NgModule } from "@angular/core";

export const productRoutes: Routes = [
  {
    path: 'product',
    children: [
      { path: '', redirectTo: 'add', pathMatch: 'full' },
      { path: 'add', component: AddProductComponent },
      { path: 'list', component: ListProductComponent },
      { path: 'edit/:id', component: EditProductComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      productRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ProductRoutingModule { }