import { OnInit, Component } from '@angular/core';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import { Store } from '@ngxs/store';
import { AddManufacturer } from '@enterprise/commerce';

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

  ngOnInit() {}
  onAddNewManufacturer(manufacturer: Manufacturer) {
    this.store.dispatch(new AddManufacturer(manufacturer));
  }
}
