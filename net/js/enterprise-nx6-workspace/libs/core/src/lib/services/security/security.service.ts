import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs/Subject';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Select } from '@ngxs/store';
import { AppState } from '../../app.state';
import { IConfiguration } from '../../models/configuration.model';
import { takeLast, take } from 'rxjs/operators';
import * as Oidc from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private actionUrl: string;
  private headers: HttpHeaders;
  private storage: StorageService;
  private authenticationSource = new Subject<boolean>();
  private authorityUrl: string;
  authenticationChallenge$ = this.authenticationSource.asObservable();
  userManager: Oidc.UserManager;
  public UserData: any;
  settings: Oidc.UserManagerSettings;

  constructor(private _http: HttpClient, private _router: Router, private route: ActivatedRoute, private _storageService: StorageService) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;

    if (this.storage.retrieve('IsAuthorized') !== undefined) {
      this.IsAuthorized = this.storage.retrieve('IsAuthorized');
      this.authenticationSource.next(true);
      this.UserData = this.storage.retrieve('userData');
    }
  }

  public IsAuthorized: boolean;

  public GetToken(): any {
    return this.storage.retrieve('authorizationData');
  }
  public Initialize(authorityUrl: string, settings: Oidc.UserManagerSettings) {
    this.authorityUrl = authorityUrl;
    this.settings = settings;
    this.userManager = new Oidc.UserManager(this.settings);
  }
  public SetAuthorizationData(token: any, id_token: any) {
    if (this.storage.retrieve('authorizationData') !== '') {
      this.storage.store('authorizationData', '');
    }

    this.storage.store('authorizationData', token);
    this.storage.store('authorizationDataIdToken', id_token);
    this.IsAuthorized = true;
    this.storage.store('IsAuthorized', true);

    this.getUserData();
  }

  public Authorize() {
    this.resetAuthorizationData();
    this.userManager.signinRedirect();
  }

  public AuthorizedCallback() {
    this.resetAuthorizationData();
    this.userManager.signinRedirectCallback().then(user => {
      if (user) {
        this.SetAuthorizationData(user.access_token, user.id_token);
      } else {
        console.log('error');
      }
    });
  }

  public Logoff() {
    this.userManager.signoutRedirect();

    this.resetAuthorizationData();

    // emit observable
    this.authenticationSource.next(false);
  }


  resetAuthorizationData() {
    this.storage.store('authorizationData', '');
    this.storage.store('authorizationDataIdToken', '');

    this.IsAuthorized = false;
    this.storage.store('IsAuthorized', false);
  }

  setAuthorizationData(token: any, id_token: any, authorityUrl: string) {
    if (this.storage.retrieve('authorizationData') !== '') {
      this.storage.store('authorizationData', '');
    }

    this.storage.store('authorizationData', token);
    this.storage.store('authorizationDataIdToken', id_token);
    this.IsAuthorized = true;
    this.storage.store('IsAuthorized', true);

    this.getUserData();
  }

  handleError(error: any) {
    console.log(error);
    if (error.status === 403) {
      this._router.navigate(['/Forbidden']);
    }
    else if (error.status === 401) {
      // this.ResetAuthorizationData();
      this._router.navigate(['/Unauthorized']);
    }
  }

  urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }

    return window.atob(output);
  }

  getDataFromToken(token: any) {
    let data = {};
    if (typeof token !== 'undefined') {
      const encoded = token.split('.')[1];
      data = JSON.parse(this.urlBase64Decode(encoded));
    }

    return data;
  }

  getUserData() {
    this.userManager.getUser().then(data => {
      if (data) {
        this.UserData = data;
        this.storage.store('userData', data);
        // emit observable
        this.authenticationSource.next(true);
      } else {
        this.authenticationSource.next(false);
      }
    }).catch(error => this.handleError(error))
  }

  setHeaders() {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');

    const token = this.GetToken();

    if (token !== '') {
      this.headers.append('Authorization', 'Bearer ' + token);
    }
  }
}
