import { State, StateContext, Selector, Action } from '@ngxs/store';
import {
  ErrorOccured,
  ResolveLoadingOverlay,
  RegisterLoadingOverlay
} from '@enterprise/core';

import { ManufacturerService } from './../services/manufacturer.service';
import {
  FetchManufacturers,
  ManufacturersFetched
} from './../shared/manufacturer.actions';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';

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

  //#region Effects and Commands
  /** Effects Fetch Manufacturer API */
  @Action(FetchManufacturers, { cancelUncompleted: true })
  fetchManufacturers({ dispatch }: StateContext<ManufacturerStateModel>) {
    // call manufacturer service
    return this.manufacturerService.getManufacturerList().subscribe(
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
  //#endregion
}
