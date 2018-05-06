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
import { HttpClientModule } from '@angular/common/http';
import { CovalentLoadingModule, CovalentDialogsModule } from '@covalent/core';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

    //#region Material Imports
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    //#endregion
    
    //#region Covalent Imports
    CovalentLoadingModule,
    CovalentDialogsModule,
    //#endregion
  ],
  exports: [
    ListItemActionsComponent,
    ReactiveFormsModule,
    HttpClientModule,

    //#region Material Imports
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    //#endregion
    
    //#region Covalent Imports
    CovalentLoadingModule,
    CovalentDialogsModule,
    //#endregion
  ],
  declarations: [ListItemActionsComponent]
})
export class SharedModule {}
