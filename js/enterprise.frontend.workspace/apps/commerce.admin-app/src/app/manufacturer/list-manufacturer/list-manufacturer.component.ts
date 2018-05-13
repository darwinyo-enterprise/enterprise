import { Component, OnInit } from '@angular/core';
import { ManufacturerState, FetchManufacturers, DeleteManufacturer } from '@enterprise/commerce/manufacturer-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { RegisterLoadingOverlay, Navigate, AppState, RoutingModel, Confirm } from '@enterprise/core';
import { Manufacturer, ManufacturerService } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IConfirmConfig } from '@covalent/core';

@Component({

  selector: 'eca-list-manufacturer',
  templateUrl: './list-manufacturer.component.html',
  styleUrls: ['./list-manufacturer.component.scss']
})
export class ListManufacturerComponent implements OnInit {
  title: string;
  selectedId: string;
  confirmModel: IConfirmConfig = {
    acceptButton: 'OK',
    cancelButton: 'Cancel',
    title: 'Delete Confirmation',
    message: 'Are you sure want to delete this manufacturer?'
  };
  /** Selector Manufacturers List
   *  This Comes from State Management.
   */
  @Select(ManufacturerState.getManufacturers)
  manufacturers$: Observable<Manufacturer[]>;

  /** Executed when Confirmation OK triggered */
  deleteSubject$: Subject<boolean>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private manufacturerService: ManufacturerService
  ) {
    this.title = 'Manufacturer List';
    this.deleteSubject$ = new Subject();
  }

  ngOnInit() {
    this.store.dispatch(FetchManufacturers);
  }

  /** Navigate when manufacturer add button clicked */
  onAddNewManufacturer() {
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../add']
    }));
  }

  /** Navigate to edit manufacturer form when clicked */
  onEditManufacturer(id: string) {
    this.store.dispatch([new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../edit', id]
    })]);
  }

  /** Open Prompt When Clicked */
  onDeleteManufacturer(id: string) {
    this.selectedId = id;
    this.deleteSubject$.pipe(take(1)).subscribe(confirmation => {
      if (confirmation) {
        this.store.dispatch(new DeleteManufacturer(this.selectedId))
      }
    });
    this.store.dispatch(new Confirm(this.confirmModel, this.deleteSubject$))

  }
}
