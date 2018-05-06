import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from './state/test.action';

@Component({
  selector: 'enterprise-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store:Store) {}

  ngOnInit() {}
  onButtonClicked(){
    this.store.dispatch(Dispatch);
  }
}
