import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//#region NGXS imports
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
//#endregion

import { RouterState } from './router.state';
import { AppState } from './app.state';

import { SharedModule } from '@enterprise/shared';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { CovalentLayoutModule } from '@covalent/core';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxsModule.forRoot([RouterState, AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    
    CovalentLayoutModule,
  ],
  exports: [SharedModule,
    PageNotFoundComponent,
    NotAuthorizedComponent,
    CovalentLayoutModule],
  declarations: [PageNotFoundComponent, NotAuthorizedComponent]
})
export class CoreModule { }
