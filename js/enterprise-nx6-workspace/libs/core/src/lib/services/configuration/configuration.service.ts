import { Injectable } from '@angular/core';
import { IConfiguration } from '../../models/configuration.model';
import { Subject } from 'rxjs/Subject';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  serverSettings: IConfiguration;
  // observable that is fired when settings are loaded from server
  private settingsLoadedSource = new Subject();
  settingsLoaded$ = this.settingsLoadedSource.asObservable();
  isReady = false;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  load() {
    const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
    const url = `${baseURI}Home/Configuration`;
    const res= this.http.get<IConfiguration>(url);
    res.subscribe((response) => {
      console.log('server settings loaded');
      this.serverSettings = response;
      console.log(this.serverSettings);
      this.storageService.store('identityUrl', this.serverSettings.identityUrl);
      this.isReady = true;
      this.settingsLoadedSource.next();
    });
  }
}
