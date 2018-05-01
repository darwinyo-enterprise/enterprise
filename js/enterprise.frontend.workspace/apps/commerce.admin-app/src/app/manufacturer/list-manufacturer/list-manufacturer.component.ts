import { Component, OnInit } from '@angular/core';
import {
  ManufacturerState,
  FetchManufacturers
} from '@enterprise/commerce/manufacturer-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { RegisterLoadingOverlay } from '@enterprise/core';
import { Manufacturer, ManufacturerService } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'eca-list-manufacturer',
  templateUrl: './list-manufacturer.component.html',
  styleUrls: ['./list-manufacturer.component.scss']
})
export class ListManufacturerComponent implements OnInit {
  title: string;

  /** Selector Manufacturers List
   *  This Comes from State Management.
   */
  @Select(ManufacturerState.getManufacturers)
  manufacturers$: Observable<Manufacturer[]>;

  constructor(
    private store: Store,
    private manufacturerService: ManufacturerService
  ) {
    this.title = 'Manufacturer List';
  }

  ngOnInit() {
    this.fetchManufacturers();
  }
  /** call manufacturer service to get manufacturers */
  fetchManufacturers() {
    this.store.dispatch([new FetchManufacturers()]);
  }
  onAddNewManufacturer() {
    console.log('Add manufacturer');
  }
  onEditManufacturer(id: string) {
    console.log(id);
    this.store.dispatch([new RegisterLoadingOverlay()]);
  }
  onDeleteManufacturer(id: string) {
    console.log(id);
  }
}
