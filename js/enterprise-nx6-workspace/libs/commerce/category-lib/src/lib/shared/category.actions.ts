import {
  Category
} from '@enterprise/commerce/catalog-lib';
import { IPageChangeEvent } from '@covalent/core';

/** Fetch Single Categories Command */
export class FetchSingleCategory {
  static readonly type = '[COMMERCE] FETCH SINGLE CATEGORIES';
  /** Category Id */
  constructor(public payload: string) { }
}

/** Single Categories Fetched Event */
export class SingleCategoryFetched {
  static readonly type = '[COMMERCE] SINGLE CATEGORIES FETCHED';
  constructor() { }
}

/** Fetch All Categories Command */
export class FetchCategories {
  static readonly type = '[COMMERCE] FETCH CATEGORIES';
  constructor() { }
}

/** All Categories Fetched Event */
export class CategoriesFetched {
  static readonly type = '[COMMERCE] CATEGORIES FETCHED';
  constructor() { }
}

/** Fetch paginated Categories List Command
 *  Used for Admin
 */
export class FetchPaginatedCategoriesList {
  static readonly type = '[COMMERCE] FETCH PAGINATED CATEGORIES LIST';
  constructor(public payload: IPageChangeEvent) { }
}

/** paginated Categories List Fetched Event
 * Used for Admin
 */
export class PaginatedCategoriesListFetched {
  static readonly type = '[COMMERCE] PAGINATED CATEGORIES LIST FETCHED';
  constructor() { }
}

/** Fetch paginated Categories Command
 *  Used Anonymously
 */
export class FetchPaginatedCategories {
  static readonly type = '[COMMERCE] FETCH PAGINATED CATEGORIES';
  constructor(public payload: IPageChangeEvent) { }
}

/** paginated Categories Fetched Event
 * Used Anonymously
 */
export class PaginatedCategoriesFetched {
  static readonly type = '[COMMERCE] PAGINATED CATEGORIES FETCHED';
  constructor() { }
}

/** Add Category Command */
export class AddCategory {
  static readonly type = '[COMMERCE] ADD CATEGORY';
  constructor(public payload: Category) { }
}

/** Category Added Event */
export class CategoryAdded {
  static readonly type = '[COMMERCE] CATEGORY ADDED';
  constructor() { }
}

/** Update Category Command */
export class UpdateCategory {
  static readonly type = '[COMMERCE] UPDATE CATEGORY';
  constructor(public payload: Category) { }
}

/** Category Updated Event */
export class CategoryUpdated {
  static readonly type = '[COMMERCE] CATEGORY UPDATED';
  constructor() { }
}

/** Delete Category Command */
export class DeleteCategory {
  static readonly type = '[COMMERCE] DELETE CATEGORY';
  /**
   *
   * @param payload ID of Category
   */
  constructor(public payload: string) { }
}

/** Category Deleted Event */
export class CategoryDeleted {
  static readonly type = '[COMMERCE] CATEGORY DELETED';
  constructor() { }
}

export class ClearSelectedCategory {
  static readonly type = '[COMMERCE] CLEAR SELECTED CATEGORY'
  constructor() { }
}

export class SelectedCategoryCleared {
  static readonly type = '[COMMERCE] SELECTED CATEGORY CLEARED'
  constructor() { }
}
