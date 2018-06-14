import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './counter/counter.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [CounterComponent],
  exports: [CounterComponent]
})
export class MaterialCounterModule { }
