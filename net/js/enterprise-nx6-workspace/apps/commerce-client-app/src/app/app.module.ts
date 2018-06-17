import { NgModule, Inject, APP_ID, PLATFORM_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@enterprise/shared';
import { CoreModule } from './core/core.module';
import { CatalogModule } from './catalog/catalog.module';
import { isPlatformBrowser } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OrderModule } from './order/order.module';
import { CommerceBasketLibModule } from '@enterprise/commerce/basket-lib/src';
import { CommerceOrderLibModule } from '@enterprise/commerce/order-lib/src';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'enterprise-commerce-client-app'
    }),
    CoreModule,
    SharedModule,
    NxModule.forRoot(),
    AppRoutingModule,
    CatalogModule,
    CommerceBasketLibModule,
    CommerceOrderLibModule,
    OrderModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
