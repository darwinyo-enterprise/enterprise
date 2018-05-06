import { Component, OnInit } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';
import { Store, Select } from '@ngxs/store';
import { UpdateManufacturer, ManufacturersMock, FetchSingleManufacturer, ManufacturerState } from '@enterprise/commerce';
import { Observable } from 'rxjs/Observable';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'eca-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.scss']
})
/** TODO: Remove Mock manufacturer */
export class EditManufacturerComponent implements OnInit {
  title: string;
  @Select(ManufacturerState.getSelectedManufacturer)
  manufacturer$: Observable<Manufacturer>;
  nameSaveButton: string;

  constructor(private store: Store) {
    this.title = 'Edit Manufacturer';
    this.nameSaveButton = 'Update';
  }

  ngOnInit() {

  }
  onManufacturerUpdate(manufacturer: Manufacturer) {
    this.store.dispatch(new UpdateManufacturer(manufacturer));
  }
}
