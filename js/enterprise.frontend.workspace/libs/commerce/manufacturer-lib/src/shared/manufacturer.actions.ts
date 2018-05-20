import {
  Manufacturer
} from '@enterprise/commerce/catalog-lib';
import { IPageChangeEvent } from '@covalent/core';

/** Fetch Single Manufacturers Command */
export class FetchSingleManufacturer {
  static readonly type = '[COMMERCE] FETCH SINGLE MANUFACTURERS';
  /** Manufacturer Id */
  constructor(public payload: string) {}
}

/** Single Manufacturers Fetched Event */
export class SingleManufacturerFetched {
  static readonly type = '[COMMERCE] SINGLE MANUFACTURERS FETCHED';
  constructor() {}
}

/** Fetch All Manufacturers Command */
export class FetchManufacturers {
  static readonly type = '[COMMERCE] FETCH MANUFACTURERS';
  constructor() {}
}

/** All Manufacturers Fetched Event */
export class ManufacturersFetched {
  static readonly type = '[COMMERCE] MANUFACTURERS FETCHED';
  constructor() {}
}


/** Fetch paginated Manufacturers List Command
 *  Used for Admin
 */
export class FetchPaginatedManufacturersList {
  static readonly type = '[COMMERCE] FETCH PAGINATED MANUFACTURERS LIST';
  constructor(public payload:IPageChangeEvent) {}
}

/** paginated Manufacturers List Fetched Event
 * Used for Admin
 */
export class PaginatedManufacturersListFetched {
  static readonly type = '[COMMERCE] PAGINATED MANUFACTURERS LIST FETCHED';
  constructor() {}
}


/** Add Manufacturer Command */
export class AddManufacturer {
  static readonly type = '[COMMERCE] ADD MANUFACTURER';
  constructor(public payload: Manufacturer) {}
}

/** Manufacturer Added Event */
export class ManufacturerAdded {
  static readonly type = '[COMMERCE] MANUFACTURER ADDED';
  constructor() {}
}

/** Update Manufacturer Command */
export class UpdateManufacturer {
  static readonly type = '[COMMERCE] UPDATE MANUFACTURER';
  constructor(public payload: Manufacturer) {}
}

/** Manufacturer Updated Event */
export class ManufacturerUpdated {
  static readonly type = '[COMMERCE] MANUFACTURER UPDATED';
  constructor() {}
}

/** Delete Manufacturer Command */
export class DeleteManufacturer {
  static readonly type = '[COMMERCE] DELETE MANUFACTURER';
  /**
   *
   * @param payload ID of Manufacturer
   */
  constructor(public payload: string) {}
}

/** Manufacturer Deleted Event */
export class ManufacturerDeleted {
  static readonly type = '[COMMERCE] MANUFACTURER DELETED';
  constructor() {}
}

export class ClearSelectedManufacturer{
  static  readonly type='[COMMERCE] CLEAR SELECTED MANUFACTURER'
  constructor(){}
}

export class SelectedManufacturerCleared{
  static  readonly type='[COMMERCE] SELECTED MANUFACTURER CLEARED'
  constructor(){}
}
