import { State, StateContext, Selector, Action, Select } from '@ngxs/store';
import {
  ErrorOccured,
  ResolveLoadingOverlay,
  RegisterLoadingOverlay,
  Navigate,
  AppState,
  RegisterLinearLoadingOverlay,
  ProgressLinearLoadingOverlay,
  Alert
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

  // DOne
  /** Command Fetch Single Manufacturer API */
  @Action(FetchSingleManufacturer, { cancelUncompleted: true })
  fetchSingleManufacturer(
    { patchState, dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: FetchSingleManufacturer
  ) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call manufacturer service
    return this.manufacturerService
      .apiV1ManufacturerByIdGet(+payload)
      .pipe(
        tap(
          (manufacturer) => patchState({
            selectedManufacturer: manufacturer
          }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, new Navigate({ commands: ['/manufacturer/list'] })]),
          () => { dispatch(SingleManufacturerFetched) }
        )
      );
  }

  // Done
  /** Single Manufacturer Fetched Event */
  @Action(SingleManufacturerFetched)
  singleManufacturerFetched(
    { dispatch }: StateContext<ManufacturerStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Effects Fetch Manufacturer API */
  @Action(FetchManufacturers, { cancelUncompleted: true })
  fetchManufacturers({ patchState, dispatch }: StateContext<ManufacturerStateModel>) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call manufacturer service
    return this.manufacturerService.apiV1ManufacturerGet()
      .pipe(
        tap(
          (manufacturers) => patchState({ manufacturers: manufacturers }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(ManufacturersFetched)
        )
      );
  }

  // Done
  /** Manufacturer Fetched Event */
  @Action(ManufacturersFetched)
  manufacturersFetched(
    { dispatch }: StateContext<ManufacturerStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Manufacturer Added Event */
  @Action(ManufacturerAdded)
  manufacturerAdded({ dispatch }: StateContext<ManufacturerStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/manufacturer/list'] }), new Alert("Manufacturer Added")])
  }

  // Done
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
        () => dispatch(ManufacturerAdded)
      )
    );
  }

  //Done
  /** Delete Manufacturer Command */
  @Action(DeleteManufacturer)
  deleteManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: DeleteManufacturer
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.manufacturerService
      .apiV1ManufacturerByIdDelete(+payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, FetchManufacturers]),
          () => dispatch(ManufacturerDeleted)
        )
      );
  }

  // Done
  /** Manufacturer Deleted Event */
  @Action(ManufacturerDeleted)
  manufacturerDeleted({ dispatch }: StateContext<ManufacturerStateModel>) {
    dispatch([FetchManufacturers, ResolveLoadingOverlay, new Alert("Manufacturer Deleted")]);
  }

  // DONE
  /** Update Manufacturer Command */
  @Action(UpdateManufacturer)
  updateManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: UpdateManufacturer
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.manufacturerService
      .apiV1ManufacturerByIdPut(payload.id, payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(ManufacturerUpdated))
      );
  }

  // Done
  /** Manufacturer Updated Event */
  @Action(ManufacturerUpdated)
  manufacturerUpdated({ dispatch }: StateContext<ManufacturerStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/manufacturer/list'] }), new Alert("Manufacturer Updated")])
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
