import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./core/dashboard/dashboard.component";
import { PageNotFoundComponent, NotAuthorizedComponent } from "@enterprise/core";
import { NgModule } from "@angular/core";
import { AdminAuthGuardService } from "@enterprise/core/src/lib/services/auth/admin-auth-guard.service";

const appRoutes: Routes = [
    { path: 'manufacturer', loadChildren: './manufacturer/manufacturer.module#ManufacturerModule', canLoad: [AdminAuthGuardService] },
    { path: 'category', loadChildren: './category/category.module#CategoryModule', canLoad: [AdminAuthGuardService] },
    { path: 'product', loadChildren: './product/product.module#ProductModule', canLoad: [AdminAuthGuardService] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AdminAuthGuardService] },

    { path: 'not-authorized', component: NotAuthorizedComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AdminAuthGuardService] },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
