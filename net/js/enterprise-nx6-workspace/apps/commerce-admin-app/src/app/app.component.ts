import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AppState,
  AppStateModel,
  SetUsername,
  Navigate,
  RoutingModel,
  RouteLinkModel,
  AppMenu,
  UserMenu
} from '@enterprise/core';
import { Observable } from 'rxjs/Observable';
import { Store, Select } from '@ngxs/store';
import { TdLoadingService, LoadingType, LoadingMode, TdMediaService, TdDigitsPipe, TdLayoutManageListComponent, TdRotateAnimation } from '@covalent/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({

  selector: 'eca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select((state: AppStateModel) => state.username)
  username$;
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
  constructor(private store: Store, private loadingService: TdLoadingService, public media: TdMediaService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer) {
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
  }
  /**
   * TODO:
   * Write Unit test, implementation hasn't done.
   * @param username user name
   */
  setUserName(username: string) {
    this.store.dispatch([new SetUsername(username), new Navigate(<RoutingModel>{
      commands: ['dashboard']
    })]);
  }
  onNavigateBtnClicked(item: RouteLinkModel) {
    this.store.dispatch(new Navigate(<RoutingModel>{
      commands: [item.route]
    }));
  }
  onAppNavigateBtnClicked(item: RouteLinkModel) {
    window.location.href = item.route;
  }



}
