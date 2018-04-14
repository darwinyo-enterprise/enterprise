import { State, Action, StateContext, Selector } from '@ngxs/store';

import { TdLoadingService, TdDialogService, LoadingType, LoadingMode } from '@covalent/core';
import {
    RegisterLoadingOverlay,
    ResolveLoadingOverlay,
    ErrorOccured,
    SetUsername
} from './app.actions';

export interface AppStateModel {
    username: string;
    errorMessage: string;
    isError: boolean;
    isLoading: boolean;
}

const defaults: AppStateModel = {
    username: '',
    errorMessage: '',
    isError: false,
    isLoading: false
};

@State<AppStateModel>({
    name: 'app',
    defaults: defaults
})
export class AppState {
    loadingAppName = 'loading-facade';
    constructor(
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService
    ) {
        this.loadingService.create({
            name: this.loadingAppName,
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
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
    //#endregion

    @Action(RegisterLoadingOverlay)
    registerLoadingOverlay({ patchState }: StateContext<AppStateModel>) {
        patchState({ isLoading: true });
        this.loadingService.register(this.loadingAppName);
    }

    @Action(ResolveLoadingOverlay)
    resolveLoadingOverlay({ patchState }: StateContext<AppStateModel>) {
        patchState({ isLoading: false, isError: false, errorMessage: '' });
        this.loadingService.resolve(this.loadingAppName);
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
