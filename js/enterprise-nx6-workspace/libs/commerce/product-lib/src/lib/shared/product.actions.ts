import {
  ProductViewModel
} from '@enterprise/commerce/catalog-lib';
import { IPageChangeEvent } from '@covalent/core';

/** Fetch Single Products Command */
export class FetchSingleProduct {
  static readonly type = '[COMMERCE] FETCH SINGLE PRODUCTS';
  /** Product Id */
  constructor(public payload: string) { }
}

/** Single Products Fetched Event */
export class SingleProductFetched {
  static readonly type = '[COMMERCE] SINGLE PRODUCTS FETCHED';
  constructor() { }
}

/** Fetch All Products Command */
export class FetchProducts {
  static readonly type = '[COMMERCE] FETCH PRODUCTS';
  constructor() { }
}

/** All Products Fetched Event */
export class ProductsFetched {
  static readonly type = '[COMMERCE] PRODUCTS FETCHED';
  constructor() { }
}


/** Fetch paginated Products List Command
 *  Used for Admin
 */
export class FetchPaginatedProductsList {
  static readonly type = '[COMMERCE] FETCH PAGINATED PRODUCTS LIST';
  constructor(public payload: IPageChangeEvent) { }
}

/** paginated Products List Fetched Event
 * Used for Admin
 */
export class PaginatedProductsListFetched {
  static readonly type = '[COMMERCE] PAGINATED PRODUCTS LIST FETCHED';
  constructor() { }
}

/** Fetch hot paginated Products List Command
 *  Used for Admin
 */
export class FetchPaginatedHotProductsList {
  static readonly type = '[COMMERCE] FETCH HOT PAGINATED PRODUCTS LIST';
  constructor() { }
}

/** paginated hot Products List Fetched Event
 * Used for Admin
 */
export class PaginatedHotProductsListFetched {
  static readonly type = '[COMMERCE] PAGINATED HOT PRODUCTS LIST FETCHED';
  constructor() { }
}


/** Fetch latest paginated Products List Command
 *  Used for Admin
 */
export class FetchPaginatedLatestProductsList {
  static readonly type = '[COMMERCE] FETCH LATEST PAGINATED PRODUCTS LIST';
  constructor() { }
}

/** paginated latest Products List Fetched Event
 * Used for Admin
 */
export class PaginatedLatestProductsListFetched {
  static readonly type = '[COMMERCE] PAGINATED LATEST PRODUCTS LIST FETCHED';
  constructor() { }
}

/** Add Product Command */
export class AddProduct {
  static readonly type = '[COMMERCE] ADD PRODUCT';
  constructor(public payload: ProductViewModel) { }
}

/** Product Added Event */
export class ProductAdded {
  static readonly type = '[COMMERCE] PRODUCT ADDED';
  constructor() { }
}

/** Update Product Command */
export class UpdateProduct {
  static readonly type = '[COMMERCE] UPDATE PRODUCT';
  constructor(public payload: ProductViewModel) { }
}

/** Product Updated Event */
export class ProductUpdated {
  static readonly type = '[COMMERCE] PRODUCT UPDATED';
  constructor() { }
}

/** Delete Product Command */
export class DeleteProduct {
  static readonly type = '[COMMERCE] DELETE PRODUCT';
  /**
   *
   * @param payload ID of Product
   */
  constructor(public payload: string) { }
}

/** Product Deleted Event */
export class ProductDeleted {
  static readonly type = '[COMMERCE] PRODUCT DELETED';
  constructor() { }
}

export class ClearSelectedProduct {
  static readonly type = '[COMMERCE] CLEAR SELECTED PRODUCT'
  constructor() { }
}

export class SelectedProductCleared {
  static readonly type = '[COMMERCE] SELECTED PRODUCT CLEARED'
  constructor() { }
}
