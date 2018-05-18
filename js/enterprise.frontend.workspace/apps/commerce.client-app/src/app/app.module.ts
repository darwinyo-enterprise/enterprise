import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { TestState } from './state/test.state';
import * as core from '@enterprise/core';

@NgModule({
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    core.CoreModule,
    NgxsModule.forFeature([TestState])
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
