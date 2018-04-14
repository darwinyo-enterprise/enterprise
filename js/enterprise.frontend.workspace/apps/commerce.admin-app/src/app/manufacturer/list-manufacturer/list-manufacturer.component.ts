import { Component, OnInit } from '@angular/core';
import {
  ManufacturerModel,
  ManufacturerService,
  ManufacturerState,
  FetchManufacturers
} from '@enterprise/commerce/manufacturer-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { RegisterLoadingOverlay } from '@enterprise/core';

@Component({
  selector: 'eca-list-manufacturer',
  templateUrl: './list-manufacturer.component.html',
  styleUrls: ['./list-manufacturer.component.scss']
})
export class ListManufacturerComponent implements OnInit {
  @Select(ManufacturerState.getManufacturers)
  manufacturers$: Observable<ManufacturerModel>;

  constructor(
    private store: Store,
    private manufacturerService: ManufacturerService
  ) {}

  ngOnInit() {
    this.fetchManufacturers();
  }
  /** call manufacturer service to get manufacturers */
  fetchManufacturers() {
    this.store.dispatch([new FetchManufacturers()]);
  }

  onEdit(id: string) {
    console.log(id);
    this.store.dispatch([new RegisterLoadingOverlay()])
  }
  onDelete(id: string) {
    console.log(id);
  }
}
