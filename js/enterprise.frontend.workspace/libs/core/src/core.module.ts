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

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    NgxsModule.forRoot([RouterState, AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  exports: [SharedModule]
})
export class CoreModule {}
