import { OnInit, Component } from '@angular/core';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import { Store } from '@ngxs/store';
import { AddManufacturer, ManufacturersMock, ClearSelectedManufacturer } from '@enterprise/commerce/manufacturer-lib';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { ClearFileUpload } from '@enterprise/material/file-upload';

@Component({

  selector: 'eca-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.scss']
})
export class AddManufacturerComponent implements OnInit {
  title: string;
  nameSaveButton: string;

  constructor(
    private manufacturerService: ManufacturerService,
    private store: Store
  ) {
    this.title = 'Add New Manufacturer';
    this.nameSaveButton = 'Add';
  }

  ngOnInit() {
    this.store.dispatch([ClearSelectedManufacturer,ClearFileUpload]);
  }
  onAddNewManufacturer(manufacturer: Manufacturer) {
    // mock id. though it will be decided on server.
    // API Cant get model properly if id is null
    manufacturer.id = 1;
    this.store.dispatch(new AddManufacturer(manufacturer));
  }
}
