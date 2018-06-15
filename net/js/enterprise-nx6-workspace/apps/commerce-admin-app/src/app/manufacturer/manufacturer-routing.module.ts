import { Routes, RouterModule } from "@angular/router";
import { AddManufacturerComponent } from "./add-manufacturer/add-manufacturer.component";
import { ListManufacturerComponent } from "./list-manufacturer/list-manufacturer.component";
import { EditManufacturerComponent } from "./edit-manufacturer/edit-manufacturer.component";
import { NgModule } from "@angular/core";
import { AdminAuthGuardService } from "@enterprise/core";

export const manufacturerRoutes: Routes = [
  {
    path: 'manufacturer',
    canActivateChild: [AdminAuthGuardService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'add', component: AddManufacturerComponent },
      { path: 'list', component: ListManufacturerComponent },
      { path: 'edit/:id', component: EditManufacturerComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      manufacturerRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ManufacturerRoutingModule { }