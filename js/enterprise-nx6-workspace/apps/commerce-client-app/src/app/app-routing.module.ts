import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent, NotAuthorizedComponent } from "@enterprise/core";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./core/home/home.component";
import { DetailCatalogComponent } from "./catalog/detail-catalog/detail-catalog.component";
import { OrderComponent } from "./order/order/order.component";

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'order', component: OrderComponent },
    { path: 'not-authorized', component: NotAuthorizedComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'product-detail/:id', component: DetailCatalogComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            // { enableTracing: true }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
