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

  constructor(private http: HttpClient, private storageService: StorageService) { }

  load() {
    const configuration: IConfiguration = {
      identityUrl: process.env.identityUrl || 'http://localhost:5105'
    }

    console.log('server settings loaded');
    this.serverSettings = configuration;
    console.log(this.serverSettings);
    this.storageService.store('identityUrl', this.serverSettings.identityUrl);
  }
}
