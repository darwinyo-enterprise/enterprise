import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../app.state';
import { Navigate } from '../../router.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  @Select(AppState.authenticated)
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAuth();
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAuth();
  }
  checkAuth() {
    let result: boolean;
    this.isAuthenticated$.subscribe(x => result = x);
    if (!result) {
      this.store.dispatch(new Navigate({
        commands: ['/not-authorized']
      }));
    }
    return result;
  }
}
