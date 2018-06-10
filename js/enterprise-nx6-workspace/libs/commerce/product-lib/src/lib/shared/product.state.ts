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
  SelectedProductCleared,
  FetchPaginatedProductsList,
  PaginatedProductsListFetched,
  FetchPaginatedHotProductsList,
  PaginatedHotProductsListFetched,
  PaginatedLatestProductsListFetched,
  FetchPaginatedLatestProductsList,
  FetchProductDetailInfo,
  ProductDetailInfoFetched
} from './../shared/product.actions';
import {
  ProductService,
  ProductViewModel,
  PaginatedListViewModelItemViewModel,
  PaginatedCatalogViewModelCatalogItemViewModel,
  CatalogItemViewModel,
  ProductDetailViewModel
} from '@enterprise/commerce/catalog-lib';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

export interface ProductStateModel {
  products: PaginatedCatalogViewModelCatalogItemViewModel;
  paginatedProducts: PaginatedListViewModelItemViewModel;
  paginatedHotProducts: CatalogItemViewModel[];
  paginatedLatestProducts: CatalogItemViewModel[];
  selectedProduct: ProductViewModel;
  selectedProductDetailInfo: ProductDetailViewModel;
}

const defaults: ProductStateModel = {
  products: null,
  paginatedProducts: null,
  paginatedHotProducts: null,
  paginatedLatestProducts: null,
  selectedProduct: null,
  selectedProductDetailInfo: null
};

@State({
  name: 'product',
  defaults: defaults
})
export class ProductState {
  constructor(private productService: ProductService) { }
  //#region Selectors
  @Selector()
  static getProducts(state: ProductStateModel) {
    return state.products;
  }

  @Selector()
  static getPaginatedLatestProduct(state: ProductStateModel) {
    return state.paginatedLatestProducts;
  }
  @Selector()
  static getPaginatedHotProduct(state: ProductStateModel) {
    return state.paginatedHotProducts;
  }
  @Selector()
  static getSelectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }
  @Selector()
  static getPaginatedProduct(state: ProductStateModel) {
    return state.paginatedProducts;
  }
  @Selector()
  static getSelectedProductDetailInfo(state: ProductStateModel) {
    return state.selectedProductDetailInfo;
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

  // DOne
  /** Command Fetch Product Detail Info API */
  @Action(FetchProductDetailInfo, { cancelUncompleted: true })
  fetchProductDetailInfo(
    { patchState, dispatch }: StateContext<ProductStateModel>,
    { payload }: FetchSingleProduct
  ) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call product service
    return this.productService
      .apiV1ProductInfoByIdGet(payload)
      .pipe(
        tap(
          (product) => patchState({
            selectedProductDetailInfo: product
          }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, new Navigate({ commands: ['/home'] })]),
          () => { dispatch(ProductDetailInfoFetched) }
        )
      );
  }

  // Done
  /** Single ProductDetailInfoFetched Event */
  @Action(ProductDetailInfoFetched)
  productDetailInfoFetched(
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
    return this.productService.apiV1ProductGet()
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
      .apiV1ProductByIdPut(payload.id, payload)
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

  /** fetch product list  */
  @Action(FetchPaginatedProductsList)
  fetchProductsList(
    { dispatch, patchState }: StateContext<ProductStateModel>,
    { payload }: FetchPaginatedProductsList) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    return this.productService
      .apiV1ProductListGet(payload.pageSize, payload.page)
      .pipe(
        tap(
          (x) => {
            patchState({
              paginatedProducts: x
            })
          },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(PaginatedProductsListFetched))
      );
  }

  @Action(PaginatedProductsListFetched)
  paginatedProductsListFetched({ dispatch }: StateContext<ProductStateModel>) {
    dispatch(ResolveLoadingOverlay);
  }

  /** fetch hot product list  */
  @Action(FetchPaginatedHotProductsList)
  fetchHotProductsList(
    { dispatch, patchState }: StateContext<ProductStateModel>) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    return this.productService
      .apiV1ProductHotGet(14, 0)
      .pipe(
        tap(
          (x) => {
            patchState({
              paginatedHotProducts: x.data
            })
          },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(PaginatedHotProductsListFetched))
      );
  }

  @Action(PaginatedHotProductsListFetched)
  paginatedHotProductsListFetched({ dispatch }: StateContext<ProductStateModel>) {
    dispatch(ResolveLoadingOverlay);
  }

  /** fetch latest product list  */
  @Action(FetchPaginatedLatestProductsList)
  fetchLatestProductsList(
    { dispatch, patchState }: StateContext<ProductStateModel>) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    return this.productService
      .apiV1ProductLatestGet(14, 0)
      .pipe(
        tap(
          (x) => {
            patchState({
              paginatedLatestProducts: x.data
            })
          },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(PaginatedLatestProductsListFetched))
      );
  }

  @Action(PaginatedLatestProductsListFetched)
  paginatedLatestProductsListFetched({ dispatch }: StateContext<ProductStateModel>) {
    dispatch(ResolveLoadingOverlay);
  }
  //#endregion
}
