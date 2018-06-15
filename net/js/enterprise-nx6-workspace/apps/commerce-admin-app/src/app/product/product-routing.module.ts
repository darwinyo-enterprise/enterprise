import { Routes, RouterModule } from "@angular/router";
import { AddProductComponent } from "./add-product/add-product.component";
import { ListProductComponent } from "./list-product/list-product.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { NgModule } from "@angular/core";
import { AdminAuthGuardService } from "@enterprise/core/src";

export const productRoutes: Routes = [
  {
    path: 'product',
    canActivateChild: [AdminAuthGuardService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
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