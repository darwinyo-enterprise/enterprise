import { TestBed, inject } from '@angular/core/testing';

import { AdminAuthGuardService } from './admin-auth-guard.service';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState, Navigate, Logged } from '@enterprise/core/src';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { noop } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminAuthGuardService', () => {
  let store: Store;
  let storeSpy: jasmine.Spy;
  let service: AdminAuthGuardService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAuthGuardService,
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
        }],
      imports: [NgxsModule.forRoot([AppState]), HttpClientModule, RouterTestingModule]
    });
    store = TestBed.get(Store);
    service = TestBed.get(AdminAuthGuardService);
  });
  const userData = {
    profile: {
      name: 'firstname',
      last_name: 'lastname',
      email: 'test@enterprise.com',
      roles:['Admin']
    }
  }
  const userDataNoRoles = {
    profile: {
      name: 'firstname',
      last_name: 'lastname',
      email: 'test@enterprise.com',
      roles:[]
    }
  }
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
        const result = service.verifyAuth();
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
      it('should return false when user dont have any roles', () => {
        store.dispatch(new Logged(userDataNoRoles));
        const result = service.verifyAuth();
        expect(result).toBeFalsy();
      })
      it('should return false when user dont have Admin role', () => {
        store.dispatch(new Logged(userDataNoAdminRoles));
        const result = service.verifyAuth();
        expect(result).toBeFalsy();
      })
      it('should return true when all criteria passed', () => {
        store.dispatch(new Logged(userData));
        const result = service.verifyAuth();
        expect(result).toBeTruthy();
      })
    })

  })
});
