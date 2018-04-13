import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    //#region Material Imports
    MatButtonModule
    //#endregion
  ],
  exports:[
    //#region Material Imports
    MatButtonModule
    //#endregion
  ]
})
export class CoreModule { }
