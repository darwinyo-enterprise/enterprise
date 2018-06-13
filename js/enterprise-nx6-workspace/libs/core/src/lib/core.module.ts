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
import {
  CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
  CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
  CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule
} from '@covalent/core';
import { ConfigurationService } from './services/configuration/configuration.service';
import { SecurityService } from './services/security/security.service';
import { StorageService } from './services/storage/storage.service';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxsModule.forRoot([RouterState, AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot(),

    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
    CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
    CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule
  ],
  exports: [SharedModule,
    PageNotFoundComponent,
    NotAuthorizedComponent,
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
    CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
    CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule],
  declarations: [PageNotFoundComponent, NotAuthorizedComponent],
  providers: [
    ConfigurationService,
    SecurityService,
    StorageService
  ]
})
export class CoreModule { }
