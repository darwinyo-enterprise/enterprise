import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { ListItemActionsComponent } from './list-item-actions/list-item-actions.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    //#region Material Imports
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
    //#endregion
  ],
  exports: [
    ListItemActionsComponent,
    ReactiveFormsModule,

    //#region Material Imports
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
    //#endregion
  ],
  declarations: [ListItemActionsComponent]
})
export class SharedModule {}
