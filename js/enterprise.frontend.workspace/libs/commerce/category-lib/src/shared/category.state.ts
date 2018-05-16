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
  FetchCategories,
  CategoriesFetched,
  CategoryAdded,
  AddCategory,
  DeleteCategory,
  CategoryDeleted,
  UpdateCategory,
  CategoryUpdated,
  FetchSingleCategory,
  SingleCategoryFetched,
  ClearSelectedCategory,
  SelectedCategoryCleared
} from './../shared/category.actions';
import {
  Category,
  CategoryService
} from '@enterprise/commerce/catalog-lib';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

export interface CategoryStateModel {
  categories: Category[];
  selectedCategory: Category;
}

const defaults: CategoryStateModel = {
  categories: [],
  selectedCategory: null
};

@State({
  name: 'category',
  defaults: defaults
})
export class CategoryState {
  constructor(private categoryService: CategoryService) { }
  //#region Selectors
  @Select(AppState.isLoading) private isLoading$: Observable<boolean>;

  private progress: number;
  @Selector()
  static getCategories(state: CategoryStateModel) {
    return state.categories;
  }

  @Selector()
  static getSelectedCategory(state: CategoryStateModel) {
    return state.selectedCategory;
  }
  //#endregion

  //#region Commands and Event

  // DOne
  /** Command Fetch Single Category API */
  @Action(FetchSingleCategory, { cancelUncompleted: true })
  fetchSingleCategory(
    { patchState, dispatch }: StateContext<CategoryStateModel>,
    { payload }: FetchSingleCategory
  ) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call category service
    return this.categoryService
      .apiV1CategoryByIdGet(+payload)
      .pipe(
        tap(
          (category) => patchState({
            selectedCategory: category
          }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, new Navigate({ commands: ['/category/list'] })]),
          () => { dispatch(SingleCategoryFetched) }
        )
      );
  }

  // Done
  /** Single Category Fetched Event */
  @Action(SingleCategoryFetched)
  singleCategoryFetched(
    { dispatch }: StateContext<CategoryStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Effects Fetch Category API */
  @Action(FetchCategories, { cancelUncompleted: true })
  fetchCategories({ patchState, dispatch }: StateContext<CategoryStateModel>) {
    // Register Loading Overlay
    dispatch(RegisterLoadingOverlay);

    // call category service
    return this.categoryService.apiV1CategoryGet()
      .pipe(
        tap(
          (categories) => patchState({ categories: categories }),
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(CategoriesFetched)
        )
      );
  }

  // Done
  /** Category Fetched Event */
  @Action(CategoriesFetched)
  categoriesFetched(
    { dispatch }: StateContext<CategoryStateModel>
  ) {
    dispatch(ResolveLoadingOverlay);
  }

  // Done
  /** Category Added Event */
  @Action(CategoryAdded)
  categoryAdded({ dispatch }: StateContext<CategoryStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/category/list'] }), new Alert("Category Added")])
  }

  // Done
  /** Add Category Command*/
  @Action(AddCategory, { cancelUncompleted: true })
  addCategory({ dispatch }: StateContext<CategoryStateModel>, { payload }: AddCategory) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    // call category service
    return this.categoryService.apiV1CategoryPost(payload).pipe(
      tap(
        () => { },
        (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
        () => dispatch(CategoryAdded)
      )
    );
  }

  //Done
  /** Delete Category Command */
  @Action(DeleteCategory)
  deleteCategory(
    { dispatch }: StateContext<CategoryStateModel>,
    { payload }: DeleteCategory
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.categoryService
      .apiV1CategoryByIdDelete(+payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, FetchCategories]),
          () => dispatch(CategoryDeleted)
        )
      );
  }

  // Done
  /** Category Deleted Event */
  @Action(CategoryDeleted)
  categoryDeleted({ dispatch }: StateContext<CategoryStateModel>) {
    dispatch([FetchCategories, ResolveLoadingOverlay, new Alert("Category Deleted")]);
  }

  // DONE
  /** Update Category Command */
  @Action(UpdateCategory)
  updateCategory(
    { dispatch }: StateContext<CategoryStateModel>,
    { payload }: UpdateCategory
  ) {
    // Register Loading Overlay
    dispatch(new RegisterLoadingOverlay());

    return this.categoryService
      .apiV1CategoryByIdPut(payload.id, payload)
      .pipe(
        tap(
          () => { },
          (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
          () => dispatch(CategoryUpdated))
      );
  }

  // Done
  /** Category Updated Event */
  @Action(CategoryUpdated)
  categoryUpdated({ dispatch }: StateContext<CategoryStateModel>) {
    dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/category/list'] }), new Alert("Category Updated")])
  }

  @Action(ClearSelectedCategory)
  clearSelectedCategory({ dispatch, patchState }: StateContext<CategoryStateModel>) {
    patchState({
      selectedCategory: {}
    })
    dispatch(SelectedCategoryCleared);
  }

  @Action(SelectedCategoryCleared)
  selectedCategoryCleared({ dispatch }: StateContext<CategoryStateModel>) {

  }
  //#endregion
}
