import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  Manufacturer,
  UploadFileModel
} from '@enterprise/commerce/catalog-lib';
import { FileUploadMocks } from '@enterprise/material/file-upload';

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

  filesUpload: UploadFileModel[];

  constructor() {
    this.uploadFile = new EventEmitter<UploadFileModel[]>();
    this.deleteFile = new EventEmitter<string>();

    this.filesUpload = FileUploadMocks;
    console.log(this.filesUpload);
    // If Input Supplied (Edit Mode)
    if (this.manufacturer != null) {
      this.filesUpload = [
        <UploadFileModel>{
          id: this.manufacturer.id.toString(),
          fileName: this.manufacturer.name.toString(),
          fileUrl: this.manufacturer.imageUrl
        }
      ];
    }
  }

  ngOnInit() {}
  onUploadFile(uploadModels: UploadFileModel[]) {
    this.uploadFile.emit(uploadModels);
  }
  onDeleteFile(name: string) {
    this.deleteFile.emit(name);
  }
}
