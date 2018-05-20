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
  FetchProducts,
  ProductsFetched,
  ProductAdded,
  AddProduct,
  DeleteProduct,
  ProductDeleted,
  UpdateProduct,
  ProductUpdated,
  FetchSingleProduct,
  SingleProductFetched,
  ClearSelectedProduct,
  SelectedProductCleared
} from './../shared/product.actions';
import {
  Product,
  ProductService,
  ProductViewModel,
  PaginatedListViewModelItemViewModel
} from '@enterprise/commerce/catalog-lib';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

export interface ProductStateModel {
  products: PaginatedListViewModelItemViewModel;
  selectedProduct: Product;
}

const defaults: ProductStateModel = {
  products: null,
  selectedProduct: null
};

@State({
  name: 'product',
  defaults: defaults
})
export class ProductState {
  constructor(private productService: ProductService) { }
  //#region Selectors
  @Select(AppState.isLoading)
  private isLoading$: Observable<boolean>;

  @Selector()
  static getProducts(state: ProductStateModel) {
    return state.products;
  }

  @Selector()
  static getSelectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }
  //#endregion

  //#region Commands and Event

  // DOne
  /** Command Fetch Single Product API */
  @Action(FetchSingleProduct, { cancelUncompleted: true })
  fetchSingleProduct(
    { patchState, dispatch }: StateContext<ProductStateModel>,
    { payload }: FetchSingleProduct
  ) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call product service
    return this.productService
      .apiV1ProductByIdGet(payload)
      .pipe(
        tap(
          (product) => patchState({
            selectedProduct: product
          }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, new Navigate({ commands: ['/product/list'] })]),
          () => { dispatch(SingleProductFetched) }
        )
      );
  }

  // Done
  /** Single Product Fetched Event */
  @Action(SingleProductFetched)
  singleProductFetched(
    { dispatch }: StateContext<ProductStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Effects Fetch Product API */
  @Action(FetchProducts, { cancelUncompleted: true })
  fetchProducts({ patchState, dispatch }: StateContext<ProductStateModel>) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call product service
    return this.productService.apiV1ProductListGet()
      .pipe(
        tap(
          (products) => patchState({ products: products }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(ProductsFetched)
        )
      );
  }

  // Done
  /** Product Fetched Event */
  @Action(ProductsFetched)
  productsFetched(
    { dispatch }: StateContext<ProductStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Product Added Event */
  @Action(ProductAdded)
  productAdded({ dispatch }: StateContext<ProductStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/product/list'] }), new Alert("Product Added")])
  }

  // Done
  /** Add Product Command*/
  @Action(AddProduct, { cancelUncompleted: true })
  addProduct({ dispatch }: StateContext<ProductStateModel>, { payload }: AddProduct) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    // call product service
    return this.productService.apiV1ProductPost(payload).pipe(
      tap(
        () => { },
        (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
        () => dispatch(ProductAdded)
      )
    );
  }

  //Done
  /** Delete Product Command */
  @Action(DeleteProduct)
  deleteProduct(
    { dispatch }: StateContext<ProductStateModel>,
    { payload }: DeleteProduct
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.productService
      .apiV1ProductByIdDelete(payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, FetchProducts]),
          () => dispatch(ProductDeleted)
        )
      );
  }

  // Done
  /** Product Deleted Event */
  @Action(ProductDeleted)
  productDeleted({ dispatch }: StateContext<ProductStateModel>) {
    dispatch([FetchProducts, ResolveLoadingOverlay, new Alert("Product Deleted")]);
  }

  // DONE
  /** Update Product Command */
  @Action(UpdateProduct)
  updateProduct(
    { dispatch }: StateContext<ProductStateModel>,
    { payload }: UpdateProduct
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.productService
      .apiV1ProductByIdPut(+payload.id, payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(ProductUpdated))
      );
  }

  // Done
  /** Product Updated Event */
  @Action(ProductUpdated)
  productUpdated({ dispatch }: StateContext<ProductStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/product/list'] }), new Alert("Product Updated")])
  }

  @Action(ClearSelectedProduct)
  clearSelectedProduct({ dispatch, patchState }: StateContext<ProductStateModel>) {
    patchState({
      selectedProduct: {}
    })
    dispatch(SelectedProductCleared);
  }

  @Action(SelectedProductCleared)
  selectedProductCleared({ dispatch }: StateContext<ProductStateModel>) {

  }
  //#endregion
}
