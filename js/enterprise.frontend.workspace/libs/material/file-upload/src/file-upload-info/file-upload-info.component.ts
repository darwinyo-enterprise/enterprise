import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'em-file-upload-info',
  templateUrl: './file-upload-info.component.html',
  styleUrls: ['./file-upload-info.component.scss']
})
export class FileUploadInfoComponent implements OnInit {
  /** Input Existing Images */
  @Input() filesUpload: UploadFileModel[];

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<UploadFileModel>;
  constructor() {
    this.deleteFile = new EventEmitter<UploadFileModel>();
  }

  ngOnInit() {}

  onDelete(uploadFileModel: UploadFileModel) {
     // delete view.
     let index = this.filesUpload.findIndex(
      x => x.fileName === uploadFileModel.fileName
    );
    // remove image by name
    this.filesUpload.splice(index, 1);

    // delete in upload file model.
    index = this.filesUpload.findIndex(
      x => x.fileName === uploadFileModel.fileName
    );

    // if file exists in upload file model.
    if (index >= 0) {
      this.filesUpload.splice(index, 1);
    }
    this.deleteFile.emit(uploadFileModel);
  }
}
