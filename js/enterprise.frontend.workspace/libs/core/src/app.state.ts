import { State, Action, StateContext, Selector } from '@ngxs/store';

import {
  TdLoadingService,
  TdDialogService,
  LoadingType,
  LoadingMode
} from '@covalent/core';
import {
  RegisterLoadingOverlay,
  ResolveLoadingOverlay,
  ErrorOccured,
  SetUsername,
  RegisterLinearLoadingOverlay,
  ResolveLinearLoadingOverlay,
  ProgressLinearLoadingOverlay
} from './app.actions';

export interface AppStateModel {
  username: string;
  errorMessage: string;
  progressLoading: number;
  isError: boolean;
  isLoading: boolean;
}

const defaults: AppStateModel = {
  username: '',
  errorMessage: '',
  progressLoading: 0,
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
    private dialogService: TdDialogService
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
      color: 'accent',
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
  static isLoading(state: AppStateModel) {
    return state.isError;
  }
  @Selector()
  static progressLoading(state: AppStateModel) {
    return state.progressLoading;
  }
  //#endregion

  @Action(ProgressLinearLoadingOverlay)
  progressLinearLoadingOverlay({ patchState }: StateContext<AppStateModel>,
    { payload }: ProgressLinearLoadingOverlay) {
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
    patchState({ isLoading: false, isError: false, errorMessage: '', progressLoading: 0 });
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
      title: 'Alert', //OPTIONAL, hides if not provided
      closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
      width: '400px' //OPTIONAL, defaults to 400px
    });
  }

  /** TODO : NOT YET DONE */
  @Action(SetUsername)
  setUsername(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SetUsername
  ) {
    patchState({ username: payload });
  }
}
