import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent, NotAuthorizedComponent } from "@enterprise/core";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./core/home/home.component";

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },

    { path: 'not-authorized', component: NotAuthorizedComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
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
