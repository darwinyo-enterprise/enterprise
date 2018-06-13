import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs/Subject';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private actionUrl: string;
  private headers: HttpHeaders;
  private storage: StorageService;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge$ = this.authenticationSource.asObservable();
  private authorityUrl = '';


  public UserData: any;

  constructor(private _http: HttpClient, private _router: Router, private route: ActivatedRoute, private _configurationService: ConfigurationService, private _storageService: StorageService) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;

    this.authorityUrl = this._configurationService.serverSettings.identityUrl
    this.storage.store('IdentityUrl', this.authorityUrl);

    if (this.storage.retrieve('IsAuthorized') !== '') {
      this.IsAuthorized = this.storage.retrieve('IsAuthorized');
      this.authenticationSource.next(true);
      this.UserData = this.storage.retrieve('userData');
    }
  }

  public IsAuthorized: boolean;

  public GetToken(): any {
    return this.storage.retrieve('authorizationData');
  }

  public Authorize() {
    this.resetAuthorizationData();

    const authorizationUrl = this.authorityUrl + '/connect/authorize';
    const client_id = 'js';
    const redirect_uri = location.origin + '/';
    const response_type = 'id_token token';
    const scope = 'openid profile orders basket marketing locations webshoppingagg orders.signalrhub';
    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.storage.store('authStateControl', state);
    this.storage.store('authNonce', nonce);

    const url =
      authorizationUrl + '?' +
      'response_type=' + encodeURI(response_type) + '&' +
      'client_id=' + encodeURI(client_id) + '&' +
      'redirect_uri=' + encodeURI(redirect_uri) + '&' +
      'scope=' + encodeURI(scope) + '&' +
      'nonce=' + encodeURI(nonce) + '&' +
      'state=' + encodeURI(state);

    window.location.href = url;
  }

  public AuthorizedCallback() {
    this.resetAuthorizationData();

    const hash = window.location.hash.substr(1);

    const result: any = hash.split('&').reduce((res: any, item: string) => {
      const parts = item.split('=');
      res[parts[0]] = parts[1];
      return res;
    }, {});

    console.log(result);

    let token = '';
    let id_token = '';
    let authResponseIsValid = false;

    if (!result.error) {

      if (result.state !== this.storage.retrieve('authStateControl')) {
        console.log('AuthorizedCallback incorrect state');
      } else {

        token = result.access_token;
        id_token = result.id_token;

        const dataIdToken: any = this.getDataFromToken(id_token);
        console.log(dataIdToken);

        // validate nonce
        if (dataIdToken.nonce !== this.storage.retrieve('authNonce')) {
          console.log('AuthorizedCallback incorrect nonce');
        } else {
          this.storage.store('authNonce', '');
          this.storage.store('authStateControl', '');

          authResponseIsValid = true;
          console.log('AuthorizedCallback state and nonce validated, returning access token');
        }
      }
    }


    if (authResponseIsValid) {
      this.setAuthorizationData(token, id_token);
    }
  }

  public Logoff() {
    const authorizationUrl = this.authorityUrl + '/connect/endsession';
    const id_token_hint = this.storage.retrieve('authorizationDataIdToken');
    const post_logout_redirect_uri = location.origin + '/';

    const url =
      authorizationUrl + '?' +
      'id_token_hint=' + encodeURI(id_token_hint) + '&' +
      'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

    this.resetAuthorizationData();

    // emit observable
    this.authenticationSource.next(false);
    window.location.href = url;
  }

  resetAuthorizationData() {
    this.storage.store('authorizationData', '');
    this.storage.store('authorizationDataIdToken', '');

    this.IsAuthorized = false;
    this.storage.store('IsAuthorized', false);
  }

  setAuthorizationData(token: any, id_token: any) {
    if (this.storage.retrieve('authorizationData') !== '') {
      this.storage.store('authorizationData', '');
    }

    this.storage.store('authorizationData', token);
    this.storage.store('authorizationDataIdToken', id_token);
    this.IsAuthorized = true;
    this.storage.store('IsAuthorized', true);

    this.getUserData()
      .subscribe(data => {
        this.UserData = data;
        this.storage.store('userData', data);
        // emit observable
        this.authenticationSource.next(true);
        window.location.href = location.origin;
      },
        error => this.handleError(error),
        () => {
          console.log(this.UserData);
        });
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

  getUserData = (): Observable<string[]> => {
    this.setHeaders();
    if (this.authorityUrl === '')
      this.authorityUrl = this.storage.retrieve('IdentityUrl');

    return this._http.get<string[]>(this.authorityUrl + '/connect/userinfo', {
      headers: this.headers
    });
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
