import { Component, OnInit } from '@angular/core';
import { CatalogItemViewModel } from '@enterprise/commerce/catalog-lib/src';
import { Store, Select } from '@ngxs/store';
import { FetchPaginatedHotProductsList, FetchPaginatedLatestProductsList, ProductState } from '@enterprise/commerce/product-lib/src';
import { Navigate } from '@enterprise/core/src';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'eca-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(ProductState.getPaginatedLatestProduct)
  newProducts: Observable<CatalogItemViewModel[]>;

  @Select(ProductState.getPaginatedHotProduct)
  hotProducts: Observable<CatalogItemViewModel[]>;

  constructor(private store: Store, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.dispatch([FetchPaginatedHotProductsList, FetchPaginatedLatestProductsList]);
  }

  onProductCardClicked(item: CatalogItemViewModel) {
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../product-list', item.catalogId]
    }));
  }
}
