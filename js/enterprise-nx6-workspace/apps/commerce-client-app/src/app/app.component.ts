import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { RouteLinkModel, UserMenu, AppMenu, Navigate, RoutingModel } from '@enterprise/core';
import { TdLoadingService, LoadingMode, TdMediaService, LoadingType } from '@covalent/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'enterprise-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
    private _domSanitizer: DomSanitizer) {
    this.loadingService.create({
      name: 'loading-facade',
      type: LoadingType.Circular,
      mode: LoadingMode.Indeterminate,
      color: 'accent'
    });
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      this._domSanitizer.bypassSecurityTrustResourceUrl
        ('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));
  }

  ngOnInit() { }

  onNavigateBtnClicked(item: RouteLinkModel) {
    this.store.dispatch(new Navigate(<RoutingModel>{
      commands: [item.route]
    }));
  }
  onAppNavigateBtnClicked(item: RouteLinkModel) {
    window.location.href = item.route;
  }
}
