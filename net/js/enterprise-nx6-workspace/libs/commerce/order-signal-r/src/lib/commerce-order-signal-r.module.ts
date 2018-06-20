import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSignalRService } from './services/signalr/signal-r.service';
@NgModule({
  imports: [CommonModule],
  providers: [OrderSignalRService]
})
export class CommerceOrderSignalRModule {}
