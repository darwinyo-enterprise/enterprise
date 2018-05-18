import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UploadFileModel } from "@enterprise/commerce/catalog-lib";
import { Select, Store } from "@ngxs/store";
import { FileUploadState } from "@enterprise/material/file-upload/src/shared/file-upload.state";
import { ValidateFileUpload, DeleteFileImage, AddFileImage, ClearFileUpload } from "@enterprise/material/file-upload/src/shared/file-upload.actions";
import { Observable } from "rxjs";

@Component({
  selector: "em-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"]
})

/** TODO : REFACTOR CODE NEEDED */
/** Can Receive All Types of File. */
export class FileUploadComponent implements OnInit {
  @Select(FileUploadState.isDisabled)
  disable: boolean;

  /** Identify is this control able to receive multiple files. */
  @Select(FileUploadState.isMultiple)
  multiple: boolean;

  /** parent id will be used for naming directory name */
  @Input()
  parentId: string;

  /** this used for generate image card for user take actions */
  @Select(FileUploadState.getFileImages)
  filesImage: UploadFileModel[];

  constructor(private store: Store) {
  }

  ngOnInit() {
    // validate is file upload control is valid
    this.store.dispatch(new ValidateFileUpload());
  }

  /** async method triggered when file reader load end */
  onFileReaderLoadEnd(event: any, file: File) {
    const base64: string = event.target.result;
    const image = {
      id: this.parentId,
      fileName: file.name,
      fileUrl: base64
    } as UploadFileModel;
    this.store.dispatch(new AddFileImage(image));
  }

  /** Triggered when you drop file to dropzone
   *  file reader async function will automatically fill uploadFileModel
   */
  onDropFileChanged(files) {
    if (files.length === 0) return;
    if (files.length > 1) {
      for (const file of files) {
        // tslint:disable-next-line:no-shadowed-variable
        const fileReader = new FileReader();
        fileReader.onloadend = (event: any) =>
          this.onFileReaderLoadEnd(event, file);
        fileReader.readAsDataURL(file);
      }
      return;
    }
    let img: File = files;
    // from btn input file.
    if (files instanceof FileList) {
      img = files.item(0);
    }

    const fileReader = new FileReader();
    fileReader.onloadend = (event: any) => this.onFileReaderLoadEnd(event, img);
    fileReader.readAsDataURL(img);
  }

  /** emit delete event */
  onFileDelete(uploadModel: UploadFileModel) {
    this.store.dispatch(new DeleteFileImage(uploadModel.fileName));
  }
}
