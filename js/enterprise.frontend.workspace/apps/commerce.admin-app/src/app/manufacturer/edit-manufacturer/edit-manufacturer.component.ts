import { Component, OnInit } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'eca-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.scss']
})
export class EditManufacturerComponent implements OnInit {
  title: string;
  manufacturer: Manufacturer;

  constructor() {
    this.title = 'Edit Manufacturer';
    this.manufacturer = <Manufacturer>{
      id:1,
      name:'Samsung',
      description:'Mobile Manufacturer'
    };
  }

  ngOnInit() { }

  onFileDelete(formFile: FormData) {
    console.log('DO SOMETHING FOR DELETE');
  }
  onFileUpload(id: string) {
    console.log('DO SOMETHING FOR UPLOAD');
  }
}
