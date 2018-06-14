import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { RouteLinkModel, UserMenu, AppMenu, Navigate, RoutingModel, SubscribeUser, LoadConfiguration, AppState, Logout, Login, IConfiguration, SecurityService } from '@enterprise/core';
import { TdLoadingService, LoadingMode, TdMediaService, LoadingType } from '@covalent/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { CartModel } from './cart/models/cart.model';

@Component({
  selector: 'eca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(AppState.authenticated)
  isAuthenticated: Observable<boolean>;

  @Select(AppState.username)
  username: Observable<string>;

  @Select(AppState.configuration)
  configuration$: Observable<IConfiguration>;

  configuration: IConfiguration;

  cartItem: CartModel[] = [];
  name = 'Enterprise';
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

  constructor(private store: Store, private loadingService: TdLoadingService,
    public media: TdMediaService,
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
    this.configuration$.subscribe(x => this.configuration = x);
    this.store.dispatch([new LoadConfiguration(environment.configuration), SubscribeUser]);

    if (window.location.hash) {
      this.securityService.AuthorizedCallback(this.configuration.identityUrl);
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
