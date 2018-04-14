import { Component, OnInit } from '@angular/core';
import {
  AppState,
  AppStateModel,
  SetUsername,
  Navigate
} from '@enterprise/core';
import { Observable } from 'rxjs/Observable';
import { Store, Select } from '@ngxs/store';
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core';

@Component({
  selector: 'enterprise-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select((state: AppStateModel) => state.username)
  username$;

  constructor(private store: Store,private loadingService:TdLoadingService) {
    
    this.loadingService.create({
      name: 'loading-facade',
      type: LoadingType.Circular,
      mode: LoadingMode.Indeterminate,
      color: 'accent',
  });
  }

  ngOnInit() {}

  /**
   * TODO:
   * Write Unit test, implementation hasn't done.
   * @param username user name
   */
  setUserName(username: string) {
    this.store.dispatch([new SetUsername(username), new Navigate('dashboard')]);
  }
}
