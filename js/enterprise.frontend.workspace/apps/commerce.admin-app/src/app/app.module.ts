import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';

import { FileUploadModule } from '@enterprise/material/file-upload';

import { CatalogModule } from './catalog/catalog.module';
import * as cc from '@enterprise/commerce/core';

@NgModule({
  imports: [
    BrowserModule,
    cc.CoreModule,
    FileUploadModule,
    CatalogModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
