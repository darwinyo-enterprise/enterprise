import { OnInit, Component } from '@angular/core';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import { Store } from '@ngxs/store';
import { AddManufacturer, ManufacturersMock } from '@enterprise/commerce';

@Component({
  // tslint:disable-next-line:component-selector
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

  ngOnInit() { }
  onAddNewManufacturer(manufacturer: Manufacturer) {
    // mock id. though it will be decided on server.
    // API Cant get model properly if id is null
    manufacturer.id = 1;
    this.store.dispatch(new AddManufacturer(manufacturer));
  }
}
