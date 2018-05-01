import { UploadFileModel, Manufacturer } from "@enterprise/commerce/catalog-lib";

/** Upload Image Manufacturer Command */
export class UploadImageManufacturer {
  static readonly type = '[COMMERCE] UPLOAD IMAGE MANUFACTURER';
  
  constructor(public payload:UploadFileModel) {}
}

/** Image Manufacturer Uploaded Event */
export class ImageManufacturerUploaded {
  static readonly type = '[COMMERCE] IMAGE MANUFACTURER UPLOADED';
  constructor() {}
}


/** Delete Image Manufacturer Command */
export class DeleteImageManufacturer {
  static readonly type = '[COMMERCE] DELETE IMAGE MANUFACTURER';
  
  constructor(public payload:UploadFileModel) {}
}

/** Image Manufacturer Deleted Event */
export class ImageManufacturerDeleted {
  static readonly type = '[COMMERCE] IMAGE MANUFACTURER DELETED';
  constructor() {}
}


/** Fetch Single Manufacturers Command */
export class FetchSingleManufacturer {
  static readonly type = '[COMMERCE] FETCH SINGLE MANUFACTURERS';
  /** Manufacturer Id */
  constructor(public payload:string) {}
}

/** Single Manufacturers Fetched Event */
export class SingleManufacturerFetched {
  static readonly type = '[COMMERCE] SINGLE MANUFACTURERS FETCHED';
  constructor(public payload: Manufacturer) {}
}


/** Fetch All Manufacturers Command */
export class FetchManufacturers {
  static readonly type = '[COMMERCE] FETCH MANUFACTURERS';
  constructor() {}
}

/** All Manufacturers Fetched Event */
export class ManufacturersFetched {
  static readonly type = '[COMMERCE] MANUFACTURERS FETCHED';
  constructor(public payload: Manufacturer[]) {}
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
