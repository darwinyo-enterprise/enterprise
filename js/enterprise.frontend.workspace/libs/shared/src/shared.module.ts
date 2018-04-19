import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ListItemActionsComponent } from './list-item-actions/list-item-actions.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    //#region Material Imports
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
    //#endregion
  ],
  exports: [
    //#region Material Imports
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
    //#endregion
  ],
  declarations: [ListItemActionsComponent]
})
export class SharedModule { }
