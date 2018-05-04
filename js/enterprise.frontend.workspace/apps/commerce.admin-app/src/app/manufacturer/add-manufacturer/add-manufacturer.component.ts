import { OnInit, Component } from '@angular/core';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import { Store } from '@ngxs/store';
import { AddManufacturer, ManufacturersMock } from '@enterprise/commerce';

@Component({
  selector: 'eca-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.scss']
})
export class AddManufacturerComponent implements OnInit {
  title: string;
  manufacturer: Manufacturer;
  nameSaveButton: string;

  constructor(
    private manufacturerService: ManufacturerService,
    private store: Store
  ) {
    this.title = 'Add New Manufacturer';
    this.nameSaveButton = 'Add';
    this.manufacturer = <Manufacturer>{};
  }

  ngOnInit() {
    this.manufacturer=ManufacturersMock[0];}
  onAddNewManufacturer(manufacturer: Manufacturer) {
    this.store.dispatch(new AddManufacturer(manufacturer));
  }
}
