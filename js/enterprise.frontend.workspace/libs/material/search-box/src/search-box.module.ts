import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { MatFormFieldModule, MatIconModule, MatButtonModule } from '@angular/material'
@NgModule({
  imports: [CommonModule,
    MatFormFieldModule, MatIconModule, MatButtonModule
  ],
  declarations: [SearchBoxComponent, SearchInputComponent]
})
export class SearchBoxModule { }
