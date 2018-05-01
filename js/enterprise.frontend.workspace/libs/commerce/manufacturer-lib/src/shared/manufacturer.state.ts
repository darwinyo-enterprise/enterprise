import { State, StateContext, Selector, Action } from '@ngxs/store';
import {
  ErrorOccured,
  ResolveLoadingOverlay,
  RegisterLoadingOverlay,
  Navigate
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

export interface ManufacturerStateModel {
  manufacturers: Manufacturer[];
}

const defaults: ManufacturerStateModel = {
  manufacturers: []
};

@State({
  name: 'manufacturer',
  defaults: defaults
})
export class ManufacturerState {
  constructor(private manufacturerService: ManufacturerService) {}
  //#region Selectors
  @Selector()
  static getManufacturers(state: ManufacturerStateModel) {
    return state.manufacturers;
  }
  //#endregion

  //#region Commands and Event

  /** Command Upload Image Manufacturer API */
  @Action(UploadImageManufacturer, { cancelUncompleted: true })
  uploadImageManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: UploadImageManufacturer
  ) {
    // call manufacturer service
    return this.manufacturerService
      .apiV1ManufacturerImagePost(payload)
      .subscribe(
        (event) => {
          // if (event.type === HttpEventType.UploadProgress) {
          //   this.isLoading$.pipe(takeUntil(this.unsubsribe$)).subscribe(x => {
          //     if (!x) {
          //       this.store.dispatch([new RegisterLinearLoadingOverlay()]);
          //     }
          //   });
          //   this.progress = Math.round(100 * event.loaded / event.total);
          //   this.store.dispatch([
          //     new ProgressLinearLoadingOverlay(this.progress)
          //   ]);
          // } else if (event.type === HttpEventType.Response)
          //   console.log(event.body.toString());
          
          // Register Loading Overlay
          dispatch(new RegisterLoadingOverlay());
          dispatch(new ImageManufacturerUploaded());
        },
        (err: Error) => dispatch(new ErrorOccured(err.message)),
        () => dispatch(new ResolveLoadingOverlay())
      );
  }

  /** Single Manufacturer Fetched Event */
  @Action(ImageManufacturerUploaded)
  imageManufacturerUploaded(
  ) {
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
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: ManufacturersFetched
  ) {
    //TODO: Navigate to Manufacturer LIST
    // dispatch(new Navigate(''))
    console.log('TODO Navigate to List');
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
  @Action(AddManufacturer)
  addManufacturer(
    { dispatch }: StateContext<ManufacturerStateModel>,
    { payload }: AddManufacturer
  ) {
    // call manufacturer service
    return this.manufacturerService.apiV1ManufacturerPost(payload).subscribe(
      manufacturers => {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());
        dispatch(new ManufacturerAdded());
      },
      (err: Error) => dispatch(new ErrorOccured(err.message)),
      () => dispatch(new ResolveLoadingOverlay())
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
