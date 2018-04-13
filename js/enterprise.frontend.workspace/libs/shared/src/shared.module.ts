import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    //#region Material Imports
    MatButtonModule,
    MatCardModule
    //#endregion
  ],
  exports: [
    //#region Material Imports
    MatButtonModule,
    MatCardModule
    //#endregion
  ]
})
export class SharedModule {}
