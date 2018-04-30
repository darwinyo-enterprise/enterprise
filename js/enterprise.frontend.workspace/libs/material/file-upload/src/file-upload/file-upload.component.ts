import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
/** TODO : REFACTOR CODE NEEDED */
/** Can Receive All Types of File. */
export class FileUploadComponent implements OnInit {
  disable: boolean;

  /** Model For Upload */
  uploadFileModel: UploadFileModel[];

  /** Identify is this control able to receive multiple files. */
  @Input() multiple: boolean;

  /** parent id will be used for naming directory name */
  @Input() parentId: string;

  /** this used for generate image card for user take actions */
  @Input() filesImage: UploadFileModel[];

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

  constructor() {
    this.uploadFile = new EventEmitter<UploadFileModel[]>();
    this.deleteFile = new EventEmitter<UploadFileModel>();
    this.uploadFileModel = [];
  }

  ngOnInit() {
    this.checkMultipleFileValidation();
  }

  /** async method triggered when file reader load end */
  onFileReaderLoadEnd(event: any, file: File) {
    let base64: string = event.target.result;
    let image = <UploadFileModel>{
      id: this.parentId,
      fileName: file.name,
      fileUrl: base64
    };

    // for upload
    this.uploadFileModel.push(image);

    // to show
    this.filesImage.push(image);

    this.checkMultipleFileValidation();
  }

  /** Triggered when you drop file to dropzone
   *  file reader async function will automatically fill uploadFileModel
   */
  onDropFileChanged(files) {
    if (files.length === 0) return;
    if (files.length > 1) {
      for (let file of files) {
        var fileReader = new FileReader();
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

    var fileReader = new FileReader();
    fileReader.onloadend = (event: any) => this.onFileReaderLoadEnd(event, img);
    fileReader.readAsDataURL(img);
  }

  onFileUpload() {
    this.uploadFile.emit(this.uploadFileModel);
  }

  /** Remove and emit delete event */
  onFileDelete(uploadModel: UploadFileModel) {
    this.deleteFile.emit(uploadModel);
    this.uploadFileModel.splice(this.uploadFileModel.indexOf(uploadModel),1)
    this.checkMultipleFileValidation();
  }

  /**
   *  this will check if single then file image card not null then disable drop area.
   */
  checkMultipleFileValidation() {
    if (!this.multiple) {
      if (this.filesImage.length > 0) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    } else {
      this.disable = false;
    }
  }
}
