import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState, Logged, LoggedOut, LoadConfiguration, SubscribeUser, Logout, Login } from '@enterprise/core/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material';
import { TdMediaService, TdLoadingService, TdDialogService } from '@covalent/core';
import { noop } from 'rxjs';
import { environment } from '../environments/environment';

export class AppPage extends BaseTestPage<AppComponent> {
  constructor(public fixture: ComponentFixture<AppComponent>) {
    super(fixture);
  }
  get cartBtn() {
    return this.query<HTMLButtonElement>("#cart-btn");
  }
  get logoutBtn() {
    return this.query<HTMLButtonElement>("#logout-btn");
  }
  get loginBtn() {
    return this.query<HTMLButtonElement>("#login-btn");
  }
  get registerBtn() {
    return this.query<HTMLButtonElement>("#register-btn");
  }
}
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let page: AppPage;
  let store: Store;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          RouterTestingModule,
          HttpClientModule,
          MatMenuModule,
          NgxsModule.forRoot([AppState])],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: TdMediaService,
            useValue: {
              registerQuery: noop,
              query: noop,
              broadcast: noop,
              createComponent: noop,
              createReplaceComponent: noop,
              register: noop,
              resolve: noop
            }
          },
          {
            provide: TdLoadingService,
            useValue: {
              registerQuery: noop,
              query: noop,
              broadcast: noop,
              create: noop,
              createComponent: noop,
              createReplaceComponent: noop,
              register: noop,
              resolve: noop
            }
          },
          {
            provide: TdDialogService,
            useValue: {
              registerQuery: noop,
              query: noop,
              broadcast: noop,
              createComponent: noop,
              createReplaceComponent: noop,
              register: noop,
              resolve: noop
            }
          }
        ]
      }
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new AppPage(fixture);
    store = TestBed.get(Store);

    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('UI Tests', () => {
    it('should hide login, and register button when user authenticated', () => {
      let auth: boolean;
      component.isAuthenticated.subscribe(x => auth = x);
      store.dispatch(new Logged('test@enterprise.com'));
      fixture.detectChanges();
      expect(page.cartBtn).not.toBeNull();
      expect(page.logoutBtn).not.toBeNull();
    })
    it('should display cart menu and log out button when user authenticated', () => {
      store.dispatch(new Logged('test@enterprise.com'));
      fixture.detectChanges();
      expect(page.loginBtn).toBeNull();
      expect(page.registerBtn).toBeNull();
    })
    it('should hide cart menu and logout button when user not authenticated', () => {
      store.dispatch(LoggedOut);
      fixture.detectChanges();
      expect(page.cartBtn).toBeNull();
      expect(page.logoutBtn).toBeNull();
    })
    it('should display login and register button when user not authenticated', () => {
      store.dispatch(LoggedOut);
      fixture.detectChanges();
      expect(page.loginBtn).not.toBeNull();
      expect(page.registerBtn).not.toBeNull();
    })

  })
  describe('Functionality Tests', () => {
    it('should dispatch load configuration, and Subscribe user on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith([new LoadConfiguration(environment.configuration), SubscribeUser]);
    })
  })
});
