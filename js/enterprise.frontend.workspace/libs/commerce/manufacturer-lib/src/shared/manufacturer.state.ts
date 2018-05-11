import { State, StateContext, Selector, Action, Select } from '@ngxs/store';
import {
  ErrorOccured,
  ResolveLoadingOverlay,
  RegisterLoadingOverlay,
  Navigate,
  AppState,
  RegisterLinearLoadingOverlay,
  ProgressLinearLoadingOverlay
} from '@enterprise/core';

import {
  FetchManufacturers,
  ManufacturersFetched,
  ManufacturerAdded,
  AddManufacturer,
  DeleteManufacturer,
  ManufacturerDeleted,
  UpdateManufacturer,
  ManufacturerUpdated,
  FetchSingleManufacturer,
  SingleManufacturerFetched,
  ClearSelectedManufacturer,
  SelectedManufacturerCleared
} from './../shared/manufacturer.actions';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

export interface ManufacturerStateModel {
  manufacturers: Manufacturer[];
  selectedManufacturer: Manufacturer;
}

const defaults: ManufacturerStateModel = {
  manufacturers: [],
  selectedManufacturer: null
};

@State({
  name: 'manufacturer',
  defaults: defaults
})
export class ManufacturerState {
  constructor(private manufacturerService: ManufacturerService) { }
  //#region Selectors
  @Select(AppState.isLoading) private isLoading$: Observable<boolean>;

  private progress: number;
  @Selector()
  static getManufacturers(state: ManufacturerStateModel) {
    return state.manufacturers;
  }

  @Selector()
  static getSelectedManufacturer(state: ManufacturerStateModel) {
    return state.selectedManufacturer;
  }
  //#endregion

  //#region Commands and Event

  /** Command Fetch Single Manufacturer API */
  @Action(FetchSingleManufacturer, { cancelUncompleted: true })
  fetchSingleManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: FetchSingleManufacturer
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    // call manufacturer service
    return this.manufacturerService
      .apiV1ManufacturerByIdGet(+payload)
      .subscribe(
        manufacturer => {
          dispatch(new SingleManufacturerFetched((<any>manufacturer).result));
        },
        (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
        () => { dispatch([new ResolveLoadingOverlay(), new ResolveLoadingOverlay()]) }
      );
  }

  /** Single Manufacturer Fetched Event */
  @Action(SingleManufacturerFetched)
  singleManufacturerFetched(
    { patchState, dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: SingleManufacturerFetched
  ) {
    patchState({
      selectedManufacturer: payload
    });
  }

  /** Effects Fetch Manufacturer API */
  @Action(FetchManufacturers, { cancelUncompleted: true })
  fetchManufacturers({ dispatch }: StateContext<ManufacturerStateModel>) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    // call manufacturer service
    return this.manufacturerService.apiV1ManufacturerGet().subscribe(
      manufacturers => {
        // Register Loading Overlay
        dispatch(new ManufacturersFetched(manufacturers));
      },
      (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
      () => dispatch(new ResolveLoadingOverlay())
    );
  }

  /** Manufacturer Fetched Event */
  @Action(ManufacturersFetched)
  manufacturersFetched(
    { patchState }: StateContext<ManufacturerStateModel>,
    { payload }: ManufacturersFetched
  ) {
    patchState({ manufacturers: payload });
  }

  /** Manufacturer Added Event */
  @Action(ManufacturerAdded)
  manufacturerAdded({ dispatch }: StateContext<ManufacturerStateModel>) {
    dispatch(new Navigate({ commands: ['/manufacturer/list'] }))
  }

  /** Add Manufacturer Command*/
  @Action(AddManufacturer, { cancelUncompleted: true })
  addManufacturer({ dispatch }: StateContext<ManufacturerStateModel>, { payload }: AddManufacturer) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    // call manufacturer service
    return this.manufacturerService.apiV1ManufacturerPost(payload).pipe(
      tap(
        () => { },
        (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
        () => dispatch([new ResolveLoadingOverlay(), new ManufacturerAdded()])
      )
    );
  }

  /** Delete Manufacturer Command */
  @Action(DeleteManufacturer)
  deleteManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: DeleteManufacturer
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return (
      this.manufacturerService
        .apiV1ManufacturerByIdDelete(+payload)
        .subscribe(() => {
          dispatch(new ManufacturerDeleted());
        }),
      // tslint:disable-next-line:no-unused-expression
      (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
      () => dispatch([ResolveLoadingOverlay, ManufacturerDeleted])
    );
  }

  /** Manufacturer Deleted Event */
  @Action(ManufacturerDeleted)
  manufacturerDeleted({ dispatch }: StateContext<ManufacturerStateModel>) {
    dispatch(new FetchManufacturers());
  }

  /** Update Manufacturer Command */
  @Action(UpdateManufacturer)
  updateManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: UpdateManufacturer
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return (
      this.manufacturerService
        .apiV1ManufacturerByIdPut(payload.id, payload)
        .pipe(tap(() => { },
          // tslint:disable-next-line:no-unused-expression
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch([ResolveLoadingOverlay, ManufacturerUpdated]))
        )
    );
  }

  /** Manufacturer Updated Event */
  @Action(ManufacturerUpdated)
  manufacturerUpdated({ dispatch }: StateContext<ManufacturerStateModel>) {
    dispatch(new Navigate({ commands: ['/manufacturer/list'] }))
  }

  @Action(ClearSelectedManufacturer)
  clearSelectedManufacturer({ dispatch, patchState }: StateContext<ManufacturerStateModel>) {
    patchState({
      selectedManufacturer: {}
    })
    dispatch(SelectedManufacturerCleared);
  }

  @Action(SelectedManufacturerCleared)
  selectedManufacturerCleared({ dispatch }: StateContext<ManufacturerStateModel>) {
    
  }
  //#endregion
}
