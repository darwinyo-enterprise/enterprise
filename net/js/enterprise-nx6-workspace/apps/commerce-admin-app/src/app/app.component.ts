import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AppState,
  AppStateModel,
  Navigate,
  RoutingModel,
  RouteLinkModel,
  AppMenu,
  UserMenu,
  IConfiguration,
  SecurityService,
  LoadAuthSettings,
  SubscribeUser,
  LoadConfiguration,
  Logout,
  Login
} from '@enterprise/core';
import { Observable } from 'rxjs/Observable';
import { Store, Select } from '@ngxs/store';
import { TdLoadingService, LoadingType, LoadingMode, TdMediaService, TdDigitsPipe, TdLayoutManageListComponent, TdRotateAnimation } from '@covalent/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { environment } from '../environments/environment';

@Component({

  selector: 'eca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(AppState.authenticated)
  isAuthenticated: Observable<boolean>;

  @Select(AppState.userData)
  userData: Observable<any>;

  @Select(AppState.configuration)
  configuration$: Observable<IConfiguration>;

  configuration: IConfiguration;
  settings: Oidc.UserManagerSettings;


  name = 'Enterprise';
  username: string;
  userEmail: string;
  routes: RouteLinkModel[] = [{
    title: 'Dashboards',
    route: '/',
    icon: 'dashboard',
  }, {
    title: 'Manufacturer',
    route: '/manufacturer',
    icon: 'insert_chart',
  }, {
    title: 'Category',
    route: '/category',
    icon: 'insert_chart',
  }, {
    title: 'Product',
    route: '/product',
    icon: 'insert_chart',
  }, {
    title: 'Inventory',
    route: '/inventory',
    icon: 'insert_chart',
  }
  ];
  usermenu: RouteLinkModel[] = UserMenu;
  appmenu: RouteLinkModel[] = AppMenu;
  constructor(private store: Store, private loadingService: TdLoadingService, public media: TdMediaService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    private securityService: SecurityService) {
    this.loadingService.create({
      name: 'loading-facade',
      type: LoadingType.Circular,
      mode: LoadingMode.Indeterminate,
      color: 'accent'
    });
    this._iconRegistry.addSvgIconInNamespace('assets', 'enterprise',
      this._domSanitizer.bypassSecurityTrustResourceUrl
        ('./assets/brand.svg'));
  }

  ngOnInit() {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();

    this.configureSettings();
    this.userData.subscribe(x => {
      if (x) {
        this.username = x.profile.name + ' ' + x.profile.last_name;
        this.userEmail = x.profile.email;
      } else {
        this.username = 'guest';
        this.userEmail = 'guest@enterprise.com';
      }
    })
  }
  /** configure settings application */
  configureSettings() {
    this.configuration$.subscribe(x => this.configuration = x);
    this.store.dispatch(new LoadConfiguration(environment.configuration));
    this.settings = {
      authority: this.configuration.identityUrl,
      client_id: 'js_commerce_admin',
      redirect_uri: location.origin + '/',
      response_type: 'id_token token',
      scope: 'openid profile orders basket catalog',
      post_logout_redirect_uri: location.origin + '/',
    }
    this.store.dispatch([new LoadAuthSettings(this.settings), SubscribeUser]);
    this.securityService.Initialize(this.configuration.identityUrl, this.settings);
    if (window.location.hash) {
      this.securityService.AuthorizedCallback();
    }
  }
  onNavigateBtnClicked(item: RouteLinkModel) {
    this.store.dispatch(new Navigate(<RoutingModel>{
      commands: [item.route]
    }));
  }
  onAppNavigateBtnClicked(item: RouteLinkModel) {
    window.location.href = item.route;
  }
  onLogoutBtnClicked() {
    this.store.dispatch(Logout);
  }
  onLoginBtnClicked() {
    this.store.dispatch(Login);
  }
  onRegisterBtnClicked() {
    window.location.href = this.configuration.identityUrl + '/Account/Register';
  }
}
