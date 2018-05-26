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
  FetchInventorys,
  InventorysFetched,
  InventoryAdded,
  AddInventory,
  DeleteInventory,
  InventoryDeleted,
  UpdateInventory,
  InventoryUpdated,
  FetchSingleInventory,
  SingleInventoryFetched,
  ClearSelectedInventory,
  SelectedInventoryCleared,
  FetchPaginatedInventorysList,
  PaginatedInventorysListFetched
} from './../shared/inventory.actions';
import {
  Inventory,
  InventoryService,
  InventoryViewModel,
  PaginatedListViewModelItemViewModel,
  PaginatedCatalogViewModelCatalogItemViewModel
} from '@enterprise/commerce/catalog-lib';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

export interface InventoryStateModel {
  inventorys: PaginatedCatalogViewModelCatalogItemViewModel;
  paginatedInventorys:PaginatedListViewModelItemViewModel;
  selectedInventory: Inventory;
}

const defaults: InventoryStateModel = {
  inventorys: null,
  paginatedInventorys:null,
  selectedInventory: null
};

@State({
  name: 'inventory',
  defaults: defaults
})
export class InventoryState {
  constructor(private inventoryService: InventoryService) { }
  //#region Selectors
  @Selector()
  static getInventorys(state: InventoryStateModel) {
    return state.inventorys;
  }

  @Selector()
  static getSelectedInventory(state: InventoryStateModel) {
    return state.selectedInventory;
  }
  @Selector()
  static getPaginatedInventory(state: InventoryStateModel) {
    return state.paginatedInventorys;
  }
  //#endregion

  //#region Commands and Event

  // DOne
  /** Command Fetch Single Inventory API */
  @Action(FetchSingleInventory, { cancelUncompleted: true })
  fetchSingleInventory(
    { patchState, dispatch }: StateContext<InventoryStateModel>,
    { payload }: FetchSingleInventory
  ) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call inventory service
    return this.inventoryService
      .apiV1InventoryByIdGet(payload)
      .pipe(
        tap(
          (inventory) => patchState({
            selectedInventory: inventory
          }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, new Navigate({ commands: ['/inventory/list'] })]),
          () => { dispatch(SingleInventoryFetched) }
        )
      );
  }

  // Done
  /** Single Inventory Fetched Event */
  @Action(SingleInventoryFetched)
  singleInventoryFetched(
    { dispatch }: StateContext<InventoryStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Effects Fetch Inventory API */
  @Action(FetchInventorys, { cancelUncompleted: true })
  fetchInventorys({ patchState, dispatch }: StateContext<InventoryStateModel>) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call inventory service
    return this.inventoryService.apiV1InventoryGet()
      .pipe(
        tap(
          (inventorys) => patchState({ inventorys: inventorys }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(InventorysFetched)
        )
      );
  }

  // Done
  /** Inventory Fetched Event */
  @Action(InventorysFetched)
  inventorysFetched(
    { dispatch }: StateContext<InventoryStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Inventory Added Event */
  @Action(InventoryAdded)
  inventoryAdded({ dispatch }: StateContext<InventoryStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/inventory/list'] }), new Alert("Inventory Added")])
  }

  // Done
  /** Add Inventory Command*/
  @Action(AddInventory, { cancelUncompleted: true })
  addInventory({ dispatch }: StateContext<InventoryStateModel>, { payload }: AddInventory) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    // call inventory service
    return this.inventoryService.apiV1InventoryPost(payload).pipe(
      tap(
        () => { },
        (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
        () => dispatch(InventoryAdded)
      )
    );
  }

  //Done
  /** Delete Inventory Command */
  @Action(DeleteInventory)
  deleteInventory(
    { dispatch }: StateContext<InventoryStateModel>,
    { payload }: DeleteInventory
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.inventoryService
      .apiV1InventoryByIdDelete(payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, FetchInventorys]),
          () => dispatch(InventoryDeleted)
        )
      );
  }

  // Done
  /** Inventory Deleted Event */
  @Action(InventoryDeleted)
  inventoryDeleted({ dispatch }: StateContext<InventoryStateModel>) {
    dispatch([FetchInventorys, ResolveLoadingOverlay, new Alert("Inventory Deleted")]);
  }

  // DONE
  /** Update Inventory Command */
  @Action(UpdateInventory)
  updateInventory(
    { dispatch }: StateContext<InventoryStateModel>,
    { payload }: UpdateInventory
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.inventoryService
      .apiV1InventoryByIdPut(+payload.id, payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(InventoryUpdated))
      );
  }

  // Done
  /** Inventory Updated Event */
  @Action(InventoryUpdated)
  inventoryUpdated({ dispatch }: StateContext<InventoryStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/inventory/list'] }), new Alert("Inventory Updated")])
  }

  @Action(ClearSelectedInventory)
  clearSelectedInventory({ dispatch, patchState }: StateContext<InventoryStateModel>) {
    patchState({
      selectedInventory: {}
    })
    dispatch(SelectedInventoryCleared);
  }

  @Action(SelectedInventoryCleared)
  selectedInventoryCleared({ dispatch }: StateContext<InventoryStateModel>) {

  }

  /** fetch inventory list  */
  @Action(FetchPaginatedInventorysList)
  fetchInventorysList(
    { dispatch, patchState }: StateContext<InventoryStateModel>,
    { payload }: FetchPaginatedInventorysList) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    return this.inventoryService
      .apiV1InventoryListGet(payload.pageSize, payload.page)
      .pipe(
        tap(
          (x) => {
            patchState({
              paginatedInventorys: x
            })
          },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(PaginatedInventorysListFetched))
      );
  }

  @Action(PaginatedInventorysListFetched)
  paginatedInventorysListFetched({ dispatch }: StateContext<InventoryStateModel>) {
    dispatch(ResolveLoadingOverlay);
  }
  //#endregion
}
