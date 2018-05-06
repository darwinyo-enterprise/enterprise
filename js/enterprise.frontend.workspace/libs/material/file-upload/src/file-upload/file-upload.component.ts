import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';
import { Select, Store } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload/src/shared/file-upload.state';
import {
  ValidateFileUpload,
  DeleteFileImage,
  AddFileImage,
  SetModeFileUpload
} from '@enterprise/material/file-upload/src/shared/file-upload.actions';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
/** TODO : REFACTOR CODE NEEDED */
/** Can Receive All Types of File. */
export class FileUploadComponent implements OnInit {
  @Select(FileUploadState.isDisabled) disable: boolean;

  /** Model For Upload */
  @Select(FileUploadState.getFileUploads) uploadFileModel: UploadFileModel[];

  /** Identify is this control able to receive multiple files. */
  @Select(FileUploadState.isMultiple) multiple: boolean;

  /** parent id will be used for naming directory name */
  @Input() parentId: string;

  /** this used for generate image card for user take actions */
  @Select(FileUploadState.getFileImages) filesImage: UploadFileModel[];

  /** Upload File Event
   *  When this triggered you must define your own service logic.
   *
   * type:
   * If Multiple Can be return UploadFileModel[]
   * if single return UploadFileModel
   */
  @Output() uploadFile: EventEmitter<UploadFileModel[] | UploadFileModel>;

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<UploadFileModel>;

  constructor(private store: Store) {
    this.uploadFile = new EventEmitter<UploadFileModel[]>();
    this.deleteFile = new EventEmitter<UploadFileModel>();
  }

  ngOnInit() {
    // validate is file upload control is valid
    this.store.dispatch(new ValidateFileUpload());
  }

  /** async method triggered when file reader load end */
  onFileReaderLoadEnd(event: any, file: File) {
    const base64: string = event.target.result;
    const image = <UploadFileModel>{
      id: this.parentId,
      fileName: file.name,
      fileUrl: base64
    };
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

  onFileUpload() {
    this.uploadFile.emit(this.uploadFileModel);
  }

  /** Remove and emit delete event */
  onFileDelete(uploadModel: UploadFileModel) {
    this.store.dispatch(new DeleteFileImage(uploadModel.fileName));
    this.deleteFile.emit(uploadModel);
  }
}
