import { Component, OnInit, Input } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';
import { FileUploadModel } from '@enterprise/material/file-upload';

@Component({
  selector: 'manufacturer-form',
  templateUrl: './manufacturer-form.component.html',
  styleUrls: ['./manufacturer-form.component.scss']
})
export class ManufacturerFormComponent implements OnInit {
  @Input() manufacturer: Manufacturer;
  filesUpload: FileUploadModel;
  constructor() {
    this.filesUpload = <FileUploadModel>{
      id: this.manufacturer.id.toString(),
      img_src: this.manufacturer.imageUrl
    };
  }

  ngOnInit() {
  }
  onUploadFile(fileForm) {
    // DO UPLOAD
    console.log('do upload');
  }
  onDeleteFile(id: string) {
    // DO DELETE
    console.log('do delete');
  }
}
