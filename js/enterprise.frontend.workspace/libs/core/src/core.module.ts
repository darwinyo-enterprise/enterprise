import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CovalentLoadingModule, CovalentDialogsModule } from '@covalent/core';

//#region NGXS imports
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
//#endregion

import { RouterState } from './router.state';
import { AppState } from './app.state';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    //#region Covalent Imports
    CovalentLoadingModule,
    CovalentDialogsModule,
    //#endregion

    NgxsModule.forRoot([RouterState, AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  exports: [
    //#region Covalent Imports
    CovalentLoadingModule,
    CovalentDialogsModule
    //#endregion
  ]
})
export class CoreModule { }
