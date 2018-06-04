import { Component, OnInit } from '@angular/core';
import { ProductState, FetchProducts, DeleteProduct, FetchPaginatedProductsList } from '@enterprise/commerce/product-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { RegisterLoadingOverlay, Navigate, AppState, RoutingModel, Confirm } from '@enterprise/core';
import { Product, ProductService, PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IConfirmConfig, IPageChangeEvent } from '@covalent/core';
import { ListItemActionState } from '@enterprise/material/list-item-actions';

@Component({

  selector: 'eca-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  title: string;
  selectedId: string;
  confirmModel: IConfirmConfig = {
    acceptButton: 'OK',
    cancelButton: 'Cancel',
    title: 'Delete Confirmation',
    message: 'Are you sure want to delete this product?'
  };

  @Select(ListItemActionState.getPageInfo)
  pageInfo$: Observable<IPageChangeEvent>;

  /** Selector Products List
   *  This Comes from State Management.
   */
  @Select(ProductState.getPaginatedProduct)
  products$: Observable<PaginatedListViewModelItemViewModel>;

  /** Executed when Confirmation OK triggered */
  deleteSubject$: Subject<boolean>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private productService: ProductService
  ) {
    this.title = 'Product List';
    this.deleteSubject$ = new Subject();
  }

  ngOnInit() {
    this.store.dispatch(new FetchPaginatedProductsList({ page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 }));
  }

  /** Navigate when product add button clicked */
  onAddNewProduct() {
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../add']
    }));
  }

  /** Navigate to edit product form when clicked */
  onEditProduct(id: string) {
    this.store.dispatch([new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../edit', id]
    })]);
  }

  /** Open Prompt When Clicked */
  onDeleteProduct(id: string) {
    this.selectedId = id;
    this.deleteSubject$.pipe(take(1)).subscribe(confirmation => {
      if (confirmation) {
        this.store.dispatch(new DeleteProduct(this.selectedId))
      }
    });
    this.store.dispatch(new Confirm(this.confirmModel, this.deleteSubject$))

  }

  /** paging changes will fetch manufacturer api */
  onPaginationChanged() {
    this.pageInfo$.pipe(take(1)).subscribe(x => {
      this.store.dispatch(new FetchPaginatedProductsList(x));
    })

  }
}
