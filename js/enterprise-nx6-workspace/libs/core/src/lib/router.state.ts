import { State, Action, StateContext } from '@ngxs/store';
import { Router, NavigationExtras } from '@angular/router';
export interface RoutingModel {
  commands: any[];
  extras?: NavigationExtras;
}
export interface RouteLinkModel {
  title: string;
  route: string;
  icon: string;
}
export class Navigate {
  static readonly type = '[ROUTER] NAVIGATE';
  constructor(public payload: RoutingModel) { }
}

@State<string>({
  name: 'router',
  defaults: ''
})
export class RouterState {
  constructor(private router: Router) { }

  @Action(Navigate)
  async changeRoute(context: StateContext<string>, action: Navigate) {
    const path = action.payload;
    await this.router.navigate(path.commands, path.extras);
    context.setState(path.commands.toString());
  }
}
