import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../app.state';
import { Observable } from 'rxjs';
import { takeLast, take } from 'rxjs/operators';
import { Navigate } from '../../router.state';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate, CanActivateChild, CanLoad {

  @Select(AppState.authenticated)
  isAuthenticated$: Observable<boolean>;

  @Select(AppState.userData)
  userData$: Observable<any>;

  constructor(private store: Store) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.verifyAuth();
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.verifyAuth();
  }
  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.verifyAuth();
  }

  verifyAuth(): boolean {
    let result: boolean;
    this.isAuthenticated$.pipe(take(1)).subscribe(x => result = x);
    if (!result) {
      this.store.dispatch(new Navigate({
        commands: ['/not-authorized']
      }));
      return result;
    }
    this.userData$.pipe(take(1)).subscribe((data) => {
      if (data.profile.roles.length === 0) {
        result = false;
      } else if (!data.profile.roles.includes('Admin')) {
        result = false;
      } else {
        result = true;
      }
    })
    if (!result) {
      this.store.dispatch(new Navigate({
        commands: ['/not-authorized']
      }));
    }
    return result;
  }
}
