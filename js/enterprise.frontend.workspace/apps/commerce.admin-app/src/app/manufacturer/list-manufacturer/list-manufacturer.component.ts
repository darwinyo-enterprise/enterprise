import { Component, OnInit } from '@angular/core';
import { ManufacturerModel, ManufacturerService } from '@enterprise/commerce';
@Component({
  selector: 'eca-list-manufacturer',
  templateUrl: './list-manufacturer.component.html',
  styleUrls: ['./list-manufacturer.component.scss']
})
export class ListManufacturerComponent implements OnInit {
  manufacturers: ManufacturerModel[];
  constructor(private manufacturerService: ManufacturerService) {
  }

  ngOnInit() {
    this.getManufacturers();
  }
  /** call manufacturer service to get manufacturers */
  getManufacturers() {
    this.manufacturerService.getManufacturerList().subscribe((manufacturers) => {
      this.manufacturers = manufacturers
    });
  }
}
