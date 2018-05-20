import { CategoryState, FetchCategories, DeleteCategory, FetchPaginatedCategoriesList } from '@enterprise/commerce/category-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { RegisterLoadingOverlay, Navigate, AppState, RoutingModel, Confirm } from '@enterprise/core';
import { Category, CategoryService, PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IConfirmConfig, IPageChangeEvent } from '@covalent/core';
import { Component, OnInit } from '@angular/core';
import { ListItemActionState } from '@enterprise/material/list-item-actions/src/shared/list-item-actions.state';

@Component({
  selector: 'eca-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {
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

  /** Selector Categories List
   *  This Comes from State Management.
   */
  @Select(CategoryState.getPaginatedCategory)
  categories$: Observable<PaginatedListViewModelItemViewModel>;

  /** Executed when Confirmation OK triggered */
  deleteSubject$: Subject<boolean>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private categoryService: CategoryService
  ) {
    this.title = 'Category List';
    this.deleteSubject$ = new Subject();
  }

  ngOnInit() {
    this.store.dispatch(new FetchPaginatedCategoriesList({ page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 }));
  }

  /** Navigate when category add button clicked */
  onAddNewCategory() {
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../add']
    }));
  }

  /** Navigate to edit category form when clicked */
  onEditCategory(id: string) {
    this.store.dispatch([new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../edit', id]
    })]);
  }

  /** Open Prompt When Clicked */
  onDeleteCategory(id: string) {
    this.selectedId = id;
    this.deleteSubject$.pipe(take(1)).subscribe(confirmation => {
      if (confirmation) {
        this.store.dispatch(new DeleteCategory(this.selectedId))
      }
    });
    this.store.dispatch(new Confirm(this.confirmModel, this.deleteSubject$))

  }

  /** paging changes will fetch category api */
  onPaginationChanged() {
    this.pageInfo$.pipe(take(1)).subscribe(x => {
      this.store.dispatch(new FetchPaginatedCategoriesList(x));
    })

  }
}
