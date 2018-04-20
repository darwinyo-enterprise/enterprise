import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileImageModel } from '../models/file-upload.model';
import { Observable } from 'rxjs/Observable';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
/** TODO : REFACTOR CODE NEEDED */
export class FileUploadComponent implements OnInit {
  uploadFileModel: UploadFileModel[];

  /** parent id will be used for naming directory name */
  @Input() parentId: string;

  /** this used for generate image card for user take actions */
  @Input() filesImage: FileImageModel[];

  /** Upload File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() uploadFile: EventEmitter<UploadFileModel[]>;

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<string>;

  constructor() {
    this.uploadFile = new EventEmitter<UploadFileModel[]>();
    this.deleteFile = new EventEmitter<string>();
    this.uploadFileModel = [];
  }

  ngOnInit() {}
  /** Triggered when you drop file to dropzone
   *  file reader async function will automaticly fill uploadFileModel
   */
  onDropFileChanged(files) {
    if (files.length === 0) return;
    for (let file of files) {
      var fileReader = new FileReader();

      fileReader.onloadend = (event: any) => {
        let base64: string = event.target.result;

        this.uploadFileModel.push(<UploadFileModel>{
          id: this.parentId,
          fileName: file.name,
          fileBase64: base64
        });
      };

      fileReader.readAsDataURL(file);
    }
  }
  onFileUpload() {
    this.uploadFile.emit(this.uploadFileModel);
  }
  onFileDelete(name: string) {
    this.deleteFile.emit(name);
  }
}
