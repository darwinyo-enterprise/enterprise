import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./core/dashboard/dashboard.component";
import { PageNotFoundComponent, NotAuthorizedComponent } from "@enterprise/core";
import { NgModule } from "@angular/core";

const appRoutes: Routes = [
    { path: 'manufacturer', loadChildren:'manufacturer/manufacturer.module#ManufacturerModule' },
    { path: 'category', loadChildren:'app/category/category.module#CategoryModule' },
    { path: 'dashboard', component: DashboardComponent },

    { path: 'not-authorized', component: NotAuthorizedComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
