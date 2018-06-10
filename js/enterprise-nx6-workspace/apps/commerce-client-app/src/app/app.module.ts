import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@enterprise/shared';
import { CoreModule } from './core/core.module';
import { CatalogModule } from './catalog/catalog.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'enterprise-commerce-client-app'
    }),
    CoreModule,
    SharedModule,
    NxModule.forRoot(),
    AppRoutingModule,
    CatalogModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }