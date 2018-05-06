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
  UploadImageManufacturer,
  ImageManufacturerUploaded
} from './../shared/manufacturer.actions';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import { HttpEventType } from '@angular/common/http';
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

  /** Command Upload Image Manufacturer API */
  @Action(UploadImageManufacturer, { cancelUncompleted: true })
  uploadImageManufacturer(
    { dispatch, getState }: StateContext<ManufacturerStateModel>,
    { payload }: UploadImageManufacturer
  ) {
    // call manufacturer service
    return this.manufacturerService
      .apiV1ManufacturerImagePost(payload, 'body', true)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            // if is loading false them dispatch register Loading
            this.isLoading$.subscribe(x => {
              if (!x) {
                dispatch([new RegisterLinearLoadingOverlay()]);
              }
            });

            this.progress = Math.round(100 * event.loaded / event.total);
            dispatch(new ProgressLinearLoadingOverlay(this.progress));
          } else if (event.type === HttpEventType.Response)
            console.log(event.body.toString());
        },
        (err: Error) => dispatch(new ErrorOccured(err.message)),
        () =>
          dispatch([
            dispatch(new ImageManufacturerUploaded()),
            new ResolveLoadingOverlay()
          ])
      );
  }

  /** Single Manufacturer Fetched Event */
  @Action(ImageManufacturerUploaded)
  imageManufacturerUploaded() {
    //TODO: DELETE UPLOAD IMAGE VARIABLES
    // dispatch(new Navigate(''))
    console.log('TODO Navigate to List');
  }

  /** Command Fetch Single Manufacturer API */
  @Action(FetchSingleManufacturer, { cancelUncompleted: true })
  fetchSingleManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: FetchSingleManufacturer
  ) {
    // call manufacturer service
    return this.manufacturerService
      .apiV1ManufacturerByIdGet(+payload)
      .subscribe(
        manufacturer => {
          // Register Loading Overlay
          dispatch(new RegisterLoadingOverlay());
          dispatch(new SingleManufacturerFetched(manufacturer));
        },
        (err: Error) => dispatch(new ErrorOccured(err.message)),
        () => dispatch(new ResolveLoadingOverlay())
      );
  }

  /** Single Manufacturer Fetched Event */
  @Action(SingleManufacturerFetched)
  singleManufacturerFetched(
    { patchState, dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: SingleManufacturerFetched
  ) {
    //TODO: Navigate to Manufacturer Edit Manufacturer
    // dispatch(new Navigate(''))
    patchState({
      selectedManufacturer: payload
    });
  }

  /** Effects Fetch Manufacturer API */
  @Action(FetchManufacturers, { cancelUncompleted: true })
  fetchManufacturers({ dispatch }: StateContext<ManufacturerStateModel>) {
    // call manufacturer service
    return this.manufacturerService.apiV1ManufacturerGet().subscribe(
      manufacturers => {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());
        dispatch(new ManufacturersFetched(manufacturers));
      },
      (err: Error) => dispatch(new ErrorOccured(err.message)),
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
    //TODO: Navigate to Manufacturer LIST
    // dispatch(new Navigate(''))
    console.log('TODO Navigate to List');
  }

  /** Add Manufacturer Command*/
  @Action(AddManufacturer, { cancelUncompleted: true })
  addManufacturer({ dispatch }: StateContext<ManufacturerStateModel>, { payload }: AddManufacturer) {
    // call manufacturer service
    return this.manufacturerService.apiV1ManufacturerPost(payload).pipe(
      tap(
        () => {
          // Register Loading Overlay
          dispatch(new RegisterLoadingOverlay());
        },
        (err: Error) => {
          dispatch(new ErrorOccured(err.message))
        },
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
    return (
      this.manufacturerService
        .apiV1ManufacturerByIdDelete(+payload)
        .subscribe(() => {
          // Register Loading Overlay
          dispatch(new RegisterLoadingOverlay());
          dispatch(new ManufacturerDeleted());
        }),
      // tslint:disable-next-line:no-unused-expression
      (err: Error) => dispatch(new ErrorOccured(err.message)),
      () => dispatch(new ResolveLoadingOverlay())
    );
  }

  /** Manufacturer Deleted Event */
  @Action(ManufacturerDeleted)
  manufacturerDeleted({ dispatch }: StateContext<ManufacturerStateModel>) {
    //TODO: Navigate to Manufacturer LIST
    // dispatch(new Navigate(''))
    console.log('TODO Navigate to List');
  }

  /** Update Manufacturer Command */
  @Action(UpdateManufacturer)
  updateManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: UpdateManufacturer
  ) {
    return (
      this.manufacturerService
        .apiV1ManufacturerByIdPut(payload.id, payload)
        .subscribe(() => {
          // Register Loading Overlay
          dispatch(new RegisterLoadingOverlay());
          dispatch(new ManufacturerUpdated());
        }),
      // tslint:disable-next-line:no-unused-expression
      (err: Error) => dispatch(new ErrorOccured(err.message)),
      () => dispatch(new ResolveLoadingOverlay())
    );
  }

  /** Manufacturer Updated Event */
  @Action(ManufacturerUpdated)
  manufacturerUpdated({ dispatch }: StateContext<ManufacturerStateModel>) {
    //TODO: Navigate to Manufacturer LIST
    // dispatch(new Navigate(''))
    console.log('TODO Navigate to List');
  }
  //#endregion
}
