import { UploadFileModel } from "@enterprise/material/file-upload";
import { ImageModel } from "@enterprise/material/gallery/src/lib/models/image.model";


/** Set Images to Gallery Command */
export class SetImages {
    static readonly type = "[GALLERY] SET IMAGES UPLOAD";

    constructor(public payload: ImageModel[]) { }
}

/** Validate file Upload Command
 */
export class SelectImage {
    static readonly type = "[GALLERY] SELECT IMAGE";

    constructor(public payload: string) { }
}
