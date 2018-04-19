import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';
import { FileUploadModel } from '@enterprise/material/file-upload';

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
  @Output() uploadFile: EventEmitter<FormData>;

  /** Delete File Event */
  @Output() deleteFile: EventEmitter<string>;

  filesUpload: FileUploadModel;
  constructor() {
    this.uploadFile = new EventEmitter<FormData>();
    this.deleteFile = new EventEmitter<string>();

    // If Input Supplied (Edit Mode)
    if (this.manufacturer != null) {
      this.filesUpload = <FileUploadModel>{
        id: this.manufacturer.id.toString(),
        img_src: this.manufacturer.imageUrl
      };
    }

  }

  ngOnInit() {
  }
  onUploadFile(fileForm: FormData) {
    this.uploadFile.emit(fileForm);
  }
  onDeleteFile(id: string) {
    this.deleteFile.emit(id);
  }
}
