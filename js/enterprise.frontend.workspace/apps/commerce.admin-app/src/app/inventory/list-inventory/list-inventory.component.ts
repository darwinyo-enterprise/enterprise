import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { Select } from '@ngxs/store';
import { ListItemActionState } from '@enterprise/material/list-item-actions';
import { IPageChangeEvent } from '@covalent/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eca-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.scss']
})
export class ListInventoryComponent implements OnInit {
  title: string;
  selectedId: string;
  confirmModel: IConfirmConfig = {
    acceptButton: 'OK',
    cancelButton: 'Cancel',
    title: 'Delete Confirmation',
    message: 'Are you sure want to delete this category?'
  };

  @Select(ListItemActionState.getPageInfo)
  pageInfo$: Observable<IPageChangeEvent>;

  /** Selector Inventories List
   *  This Comes from State Management.
   */
  @Select(InventoryState.getPaginatedInventory)
  inventories$: Observable<PaginatedListViewModelItemViewModel>;

  /** Executed when Confirmation OK triggered */
  deleteSubject$: Subject<boolean>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private categoryService: InventoryService
  ) {
    this.title = 'Inventory List';
    this.deleteSubject$ = new Subject();
  }

  ngOnInit() {
    this.store.dispatch(new FetchPaginatedInventoriesList({ page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 }));
  }

  /** Navigate to edit category form when clicked */
  onEditInventory(id: string) {
    this.store.dispatch([new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../edit', id]
    })]);
  }

  /** paging changes will fetch category api */
  onPaginationChanged() {
    this.pageInfo$.pipe(take(1)).subscribe(x => {
      this.store.dispatch(new FetchPaginatedInventoriesList(x));
    })

  }
}
