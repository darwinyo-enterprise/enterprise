import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { noop } from 'rxjs';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState, Logged, Navigate } from '@enterprise/core/src';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardService', () => {
  let store: Store;
  let storeSpy: jasmine.Spy;
  let service: AuthGuardService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardService,{
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
      }],
    imports: [NgxsModule.forRoot([AppState]), HttpClientModule, RouterTestingModule]
    });
    store = TestBed.get(Store);
    service = TestBed.get(AuthGuardService);
  });
  const userDataNoAdminRoles = {
    profile: {
      name: 'firstname',
      last_name: 'lastname',
      email: 'test@enterprise.com',
      roles:['Test']
    }
  }
  describe('Functionality Test', () => {
    describe('spyCallFake', () => {
      beforeEach(() => {

        storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
      })
      it('should return false and dispatch navigate if user is not authenticated', () => {
        const result = service.checkAuth();
        expect(result).toBeFalsy();
        expect(store.dispatch).toHaveBeenCalledWith(
          new Navigate({
            commands: ['/not-authorized']
          }))
      })
    })
    describe('spyCallThrough', () => {
      beforeEach(() => {

        storeSpy = spyOn(store, 'dispatch').and.callThrough();
      })
      it('should return true when all criteria passed', () => {
        store.dispatch(new Logged(userDataNoAdminRoles));
        const result = service.checkAuth();
        expect(result).toBeTruthy();
      })
    })

  })
});
