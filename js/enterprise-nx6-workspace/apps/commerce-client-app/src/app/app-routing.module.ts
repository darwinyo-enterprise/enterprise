import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent, NotAuthorizedComponent } from "@enterprise/core";
import { NgModule } from "@angular/core";
import { HomeComponent } from "apps/commerce-client-app/src/app/core/home/home.component";

const appRoutes: Routes = [
    { path: 'manufacturer', loadChildren: './manufacturer/manufacturer.module#ManufacturerModule' },
    { path: 'category', loadChildren: './category/category.module#CategoryModule' },
    { path: 'product', loadChildren: './product/product.module#ProductModule' },
    { path: 'home', component: HomeComponent },

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
