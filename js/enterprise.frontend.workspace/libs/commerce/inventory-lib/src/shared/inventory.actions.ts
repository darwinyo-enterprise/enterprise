import {
  Inventory, InventoryViewModel
} from '@enterprise/commerce/catalog-lib';
import { IPageChangeEvent } from '@covalent/core';

/** Fetch Single Inventorys Command */
export class FetchSingleInventory {
  static readonly type = '[COMMERCE] FETCH SINGLE PRODUCTS';
  /** Inventory Id */
  constructor(public payload: string) { }
}

/** Single Inventorys Fetched Event */
export class SingleInventoryFetched {
  static readonly type = '[COMMERCE] SINGLE PRODUCTS FETCHED';
  constructor() { }
}

/** Fetch All Inventorys Command */
export class FetchInventorys {
  static readonly type = '[COMMERCE] FETCH PRODUCTS';
  constructor() { }
}

/** All Inventorys Fetched Event */
export class InventorysFetched {
  static readonly type = '[COMMERCE] PRODUCTS FETCHED';
  constructor() { }
}


/** Fetch paginated Inventorys List Command
 *  Used for Admin
 */
export class FetchPaginatedInventorysList {
  static readonly type = '[COMMERCE] FETCH PAGINATED PRODUCTS LIST';
  constructor(public payload: IPageChangeEvent) { }
}

/** paginated Inventorys List Fetched Event
 * Used for Admin
 */
export class PaginatedInventorysListFetched {
  static readonly type = '[COMMERCE] PAGINATED PRODUCTS LIST FETCHED';
  constructor() { }
}

/** Add Inventory Command */
export class AddInventory {
  static readonly type = '[COMMERCE] ADD PRODUCT';
  constructor(public payload: InventoryViewModel) { }
}

/** Inventory Added Event */
export class InventoryAdded {
  static readonly type = '[COMMERCE] PRODUCT ADDED';
  constructor() { }
}

/** Update Inventory Command */
export class UpdateInventory {
  static readonly type = '[COMMERCE] UPDATE PRODUCT';
  constructor(public payload: InventoryViewModel) { }
}

/** Inventory Updated Event */
export class InventoryUpdated {
  static readonly type = '[COMMERCE] PRODUCT UPDATED';
  constructor() { }
}

/** Delete Inventory Command */
export class DeleteInventory {
  static readonly type = '[COMMERCE] DELETE PRODUCT';
  /**
   *
   * @param payload ID of Inventory
   */
  constructor(public payload: string) { }
}

/** Inventory Deleted Event */
export class InventoryDeleted {
  static readonly type = '[COMMERCE] PRODUCT DELETED';
  constructor() { }
}

export class ClearSelectedInventory {
  static readonly type = '[COMMERCE] CLEAR SELECTED PRODUCT'
  constructor() { }
}

export class SelectedInventoryCleared {
  static readonly type = '[COMMERCE] SELECTED PRODUCT CLEARED'
  constructor() { }
}
