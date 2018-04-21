import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Manufacturer, UploadFileModel } from '@enterprise/commerce/catalog-lib';
import { FileImageModel } from '@enterprise/material/file-upload';

@Component({
  selector: 'eca-manufacturer-form',
  templateUrl: './manufacturer-form.component.html',
  styleUrls: ['./manufacturer-form.component.scss']
})
export class ManufacturerFormComponent implements OnInit {
  /** Title of form */
  @Input() title: string;
  /** Manufacturer if supplied then its in edit mode */
  @Input() manufacturer: Manufacturer;

  /** Upload File Event */
  @Output() uploadFile: EventEmitter<UploadFileModel[]>;

  /** Delete File Event */
  @Output() deleteFile: EventEmitter<string>;

  filesUpload: FileImageModel;
  constructor() {
    this.uploadFile = new EventEmitter<UploadFileModel[]>();
    this.deleteFile = new EventEmitter<string>();

    // If Input Supplied (Edit Mode)
    if (this.manufacturer != null) {
      this.filesUpload = <FileImageModel>{
        name: this.manufacturer.name.toString(),
        imgUrl: this.manufacturer.imageUrl
      };
    }

  }

  ngOnInit() {
  }
  onUploadFile(uploadModels: UploadFileModel[]) {
    this.uploadFile.emit(uploadModels);
  }
  onDeleteFile(name: string) {
    this.deleteFile.emit(name);
  }
}
