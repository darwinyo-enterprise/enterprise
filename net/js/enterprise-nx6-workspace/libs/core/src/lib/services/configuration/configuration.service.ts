import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { IConfiguration } from '../../models/configuration.model';
import { take } from 'rxjs/operators';
import { LoadConfiguration } from '../../app.actions';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient, private store: Store) { }
  getProcessEnvConfiguration() {
    if (!isDevMode()) {
      const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
      const url = `${baseURI}api/configuration`;

      this.http.get(url).pipe(take(1)).subscribe((x: IConfiguration) => {
        this.store.dispatch(new LoadConfiguration(x))
      });
    }
  }
}
