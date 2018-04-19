import { Component, OnInit } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'eca-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.scss']
})
export class AddManufacturerComponent implements OnInit {
  title: string;
  manufacturer: Manufacturer;

  constructor() {
    this.title = 'Add New Manufacturer';
    this.manufacturer = <Manufacturer>{};
  }

  ngOnInit() { }

  onFileDelete(formFile: FormData) {
    console.log('DO SOMETHING FOR DELETE');
  }
  onFileUpload(id: string) {
    console.log('DO SOMETHING FOR UPLOAD');
  }
}
