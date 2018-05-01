import { UploadFileModel } from '@enterprise/commerce/catalog-lib';

/** Set Multiple Mode File Upload Command */
export class SetModeFileUpload {
  static readonly type = '[FILE-UPLOAD] SET MODE FILE UPLOAD';

  /** Set Mode of file upload */
  constructor(public payload: boolean) {}
}

/** Clear file upload variable Command
 */
export class ClearFileUpload {
  static readonly type = '[FILE-UPLOAD] CLEAR FILE UPLOAD';

  constructor() {}
}

/** File upload variable Cleared Event
 */
export class FileUploadCleared {
  static readonly type = '[FILE-UPLOAD] FILE UPLOAD CLEARED';

  constructor() {}
}

/** Delete file Image Command
 */
export class DeleteFileImage {
  static readonly type = '[FILE-UPLOAD] DELETE FILE IMAGE';

  constructor(public payload: string) {}
}

/** File Image Deleted Event
 */
export class FileImageDeleted {
  static readonly type = '[FILE-UPLOAD] FILE UPLOAD DELETED';

  constructor() {}
}

/** Add file Image Command
 */
export class AddFileImage {
  static readonly type = '[FILE-UPLOAD] ADD FILE IMAGE';

  constructor(public payload: UploadFileModel[] | UploadFileModel) {}
}

/** File Image Added Event
 */
export class FileImageAdded {
  static readonly type = '[FILE-UPLOAD] FILE IMAGE ADDED';

  constructor() {}
}

/** Validate file Upload Command
 */
export class ValidateFileUpload {
  static readonly type = '[FILE-UPLOAD] VALIDATE';

  constructor() {}
}
