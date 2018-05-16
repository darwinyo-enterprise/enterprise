import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';

import { CatalogModule } from './catalog/catalog.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@enterprise/shared';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'enterprise-commerce-admin-app'
    }),
    CoreModule,
    SharedModule,
    CatalogModule,
    NxModule.forRoot(),
    AppRoutingModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {
    const platform = isPlatformBrowser(platformId)
      ? 'in the browser'
      : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
