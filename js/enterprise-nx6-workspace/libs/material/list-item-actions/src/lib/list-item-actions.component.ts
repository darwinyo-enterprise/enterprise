
import { ListItemModel } from "./models/list-item.model";
import { Observable } from "rxjs/Observable";
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { PaginatedListViewModelItemViewModel } from "@enterprise/commerce/catalog-lib";
import { IPageChangeEvent } from "@covalent/core/paging";
import { TdMediaService, TdPagingBarComponent } from "@covalent/core";
import { ReplaySubject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { Store, Select } from "@ngxs/store";
import { ChangePagination, ChangePageSize } from "./shared/list-item-actions.actions";
import { MatSelect } from "@angular/material/select";
import { ListItemActionState } from "./shared/list-item-actions.state";

@Component({

  selector: "em-list-item-actions",
  templateUrl: "./list-item-actions.component.html",
  styleUrls: ["./list-item-actions.component.scss"]
})
export class ListItemActionsComponent implements OnInit, OnDestroy {
  @ViewChild('pagingBarResponsive')
  pagingBarResponsive: TdPagingBarComponent;

  eventResponsive: IPageChangeEvent;
  pageSize: number;
  total: number;

  @Select(ListItemActionState.getPageInfo)
  pageInfo$: Observable<IPageChangeEvent>;

  @Input()
  title: string;
  @Input()
  items$: Observable<PaginatedListViewModelItemViewModel>;

  /** Edit Item Event */
  @Output()
  editItem: EventEmitter<string>;

  /** Delete Item Event */
  @Output()
  deleteItem: EventEmitter<string>;

  /** Add New Item Event */
  @Output()
  addNewItem: EventEmitter<null>;

  /** Pagination Changed event */
  @Output()
  pagingChanged: EventEmitter<null>;

  unsubscribe$: ReplaySubject<boolean>;
  constructor(public media: TdMediaService, private store: Store) {
    this.editItem = new EventEmitter<string>();
    this.deleteItem = new EventEmitter<string>();
    this.addNewItem = new EventEmitter<null>();
    this.pagingChanged = new EventEmitter<null>();
    this.unsubscribe$ = new ReplaySubject(1);

  }

  ngOnInit() {
    this.items$
      .subscribe(x => {
        if (x !== null) {
          this.pageSize = x.pageSize;
          this.total = x.count;
        }
      })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
  }

  onEdit(id: string) {
    this.editItem.emit(id);
  }

  onDelete(id: string) {
    this.deleteItem.emit(id);
  }

  onAddNew() {
    this.addNewItem.emit();
  }
  onPaginationChanged(event: IPageChangeEvent) {
    this.eventResponsive = event;
    this.store.dispatch(new ChangePagination(event));
    this.pagingChanged.emit();
  }
}
