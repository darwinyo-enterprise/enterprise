import { State, Action, StateContext, Selector } from '@ngxs/store';

import {
  TdLoadingService,
  TdDialogService,
  LoadingType,
  LoadingMode,
  IConfirmConfig
} from '@covalent/core';
import {
  RegisterLoadingOverlay,
  ResolveLoadingOverlay,
  ErrorOccured,
  SetUsername,
  RegisterLinearLoadingOverlay,
  ResolveLinearLoadingOverlay,
  ProgressLinearLoadingOverlay,
  Confirm,
  Confirmed,
  Alert,
  Logged,
  SubscribeUser,
  Logout,
  Login,
  LoggedOut
} from './app.actions';
import { ConfigurationService } from './services/configuration/configuration.service';
import { SecurityService } from './services/security/security.service';

export interface AppStateModel {
  authenticated: boolean;
  username: string;
  alertMessage: string;
  errorMessage: string;
  progressLoading: number;
  confirmModel: IConfirmConfig;
  confirmation: boolean;
  isError: boolean;
  isLoading: boolean;
}

const defaults: AppStateModel = {
  authenticated: false,
  username: '',
  alertMessage: '',
  errorMessage: '',
  progressLoading: 0,
  confirmModel: null,
  confirmation: false,
  isError: false,
  isLoading: false
};

@State<AppStateModel>({
  name: 'app',
  defaults: defaults
})
export class AppState {
  circularLoadingAppName = 'circular-loading-facade';
  linearLoadingAppName = 'linear-loading-facade';
  constructor(
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService
  ) {
    this.loadingService.create({
      name: this.circularLoadingAppName,
      type: LoadingType.Circular,
      mode: LoadingMode.Indeterminate,
      color: 'accent'
    });
    this.loadingService.create({
      name: this.linearLoadingAppName,
      mode: LoadingMode.Determinate,
      type: LoadingType.Linear,
      color: 'accent'
    });
  }
  //#region Selectors
  @Selector()
  static isError(state: AppStateModel) {
    return state.isError;
  }
  @Selector()
  static errorMessage(state: AppStateModel) {
    return state.errorMessage;
  }
  @Selector()
  static alertMessage(state: AppStateModel) {
    return state.alertMessage;
  }
  @Selector()
  static isLoading(state: AppStateModel) {
    return state.isError;
  }
  @Selector()
  static progressLoading(state: AppStateModel) {
    return state.progressLoading;
  }
  @Selector()
  static confirmation(state: AppStateModel) {
    return state.confirmation;
  }
  //#endregion

  @Action(ProgressLinearLoadingOverlay)
  progressLinearLoadingOverlay(
    { patchState }: StateContext<AppStateModel>,
    { payload }: ProgressLinearLoadingOverlay
  ) {
    patchState({ isLoading: true, progressLoading: payload });
    this.loadingService.setValue(this.linearLoadingAppName, payload);
  }

  @Action(RegisterLinearLoadingOverlay)
  registerLinearLoadingOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: true, progressLoading: 0 });
    this.loadingService.register(this.linearLoadingAppName);
  }

  @Action(ResolveLinearLoadingOverlay)
  resolveLinearLoadingOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({
      isLoading: false,
      isError: false,
      errorMessage: '',
      progressLoading: 0
    });
    this.loadingService.resolve(this.linearLoadingAppName);
  }

  @Action(RegisterLoadingOverlay)
  registerLoadingOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: true });
    this.loadingService.register(this.circularLoadingAppName);
  }

  @Action(ResolveLoadingOverlay)
  resolveLoadingOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: false, isError: false, errorMessage: '' });
    this.loadingService.resolve(this.circularLoadingAppName);
  }

  @Action(ErrorOccured)
  errorOccured(
    { patchState }: StateContext<AppStateModel>,
    { payload }: ErrorOccured
  ) {
    patchState({ errorMessage: payload, isError: true });
    this.dialogService.openAlert({
      message: payload,
      title: 'Error Occured', //OPTIONAL, hides if not provided
      closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
      width: '400px' //OPTIONAL, defaults to 400px
    });
  }

  /** Login Command */
  @Action(Login)
  login(
    { patchState }: StateContext<AppStateModel>
  ) {
    this.securityService.Authorize();
  }

  /** Logout Command */
  @Action(Logout)
  logout(
    { patchState }: StateContext<AppStateModel>
  ) {
    this.securityService.Logoff();
  }

  /** Logged Event */
  @Action(Logged)
  logged(
    { patchState }: StateContext<AppStateModel>
  ) {
    console.log('Logged')
  }
  /** Logged Out Event */
  @Action(LoggedOut)
  loggedOut(
    { patchState }: StateContext<AppStateModel>
  ) {
    console.log('Logged Out')
  }

  /** Subscribe user auth command */
  @Action(SubscribeUser)
  subscribeUser(
    { getState, patchState, dispatch }: StateContext<AppStateModel>
  ) {
    const state = getState();
    this.securityService.authenticationChallenge$.subscribe(res => {
      if (res) {
        patchState({
          authenticated: res,
          username: this.securityService.UserData.email
        })
        dispatch(Logged);
      } else {
        patchState({
          authenticated: res,
          username: ''
        })
        dispatch(LoggedOut);
      }
    });

    if (window.location.hash) {
      this.securityService.AuthorizedCallback();
    }

  }

  @Action(Confirm)
  confirm(
    { patchState, dispatch }: StateContext<AppStateModel>,
    { payload, handler }: Confirm
  ) {
    patchState({
      confirmModel: payload
    });
    this.dialogService
      .openConfirm(payload)
      .afterClosed()
      .subscribe((accept: boolean) => {
        dispatch(new Confirmed(accept));
        handler.next(accept);
      });
  }

  @Action(Confirmed)
  confirmed(
    { patchState }: StateContext<AppStateModel>,
    { payload }: Confirmed
  ) {
    patchState({
      confirmation: payload
    });
  }

  @Action(Alert)
  alert(
    { patchState }: StateContext<AppStateModel>,
    { payload }: Alert
  ) {
    patchState({
      alertMessage: payload
    });
    this.dialogService.openAlert({
      message: payload,
      title: 'Alert', //OPTIONAL, hides if not provided
      closeButton: 'OK', //OPTIONAL, defaults to 'CLOSE'
      width: '400px' //OPTIONAL, defaults to 400px
    });
  }
}
