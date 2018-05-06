import { Component, OnInit } from '@angular/core';
import { ManufacturerState, FetchManufacturers, DeleteManufacturer } from '@enterprise/commerce/manufacturer-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { RegisterLoadingOverlay, Navigate, AppState } from '@enterprise/core';
import { Manufacturer, ManufacturerService } from '@enterprise/commerce/catalog-lib';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'eca-list-manufacturer',
  templateUrl: './list-manufacturer.component.html',
  styleUrls: ['./list-manufacturer.component.scss']
})
export class ListManufacturerComponent implements OnInit {
  title: string;
  selectedId: string;
  /** Selector Manufacturers List
   *  This Comes from State Management.
   */
  @Select(ManufacturerState.getManufacturers)
  manufacturers$: Observable<Manufacturer[]>;

  @Select(AppState.confirmation) confirmation$: Observable<boolean>;

  constructor(
    private store: Store,
    private manufacturerService: ManufacturerService
  ) {
    this.title = 'Manufacturer List';
  }

  ngOnInit() {
    this.fetchManufacturers();
    this.confirmation$.subscribe(confirmation =>
      this.store.dispatch(new DeleteManufacturer(this.selectedId))
    );
  }

  /** call manufacturer service to get manufacturers */
  fetchManufacturers() {
    this.store.dispatch(new FetchManufacturers());
  }

  /** Navigate when manufacturer add button clicked */
  onAddNewManufacturer() {
    this.store.dispatch(new Navigate('manufacturer-add'));
  }

  /** Navigate to edit manufacturer form when clicked */
  onEditManufacturer(id: string) {
    console.log(id);
    this.store.dispatch([new RegisterLoadingOverlay()]);
  }

  /** Open Prompt When Clicked */
  onDeleteManufacturer(id: string) {
    console.log(id);
  }
}
