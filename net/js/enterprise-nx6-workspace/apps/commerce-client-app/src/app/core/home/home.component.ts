import { Component, OnInit } from '@angular/core';
import { CatalogItemViewModel, ItemViewModel, Manufacturer, Category } from '@enterprise/commerce/catalog-lib/src';
import { Store, Select } from '@ngxs/store';
import { FetchPaginatedHotProductsList, FetchPaginatedLatestProductsList, ProductState } from '@enterprise/commerce/product-lib/src';
import { Navigate } from '@enterprise/core/src';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ManufacturerState, FetchPaginatedManufacturers } from '@enterprise/commerce/manufacturer-lib/src';
import { CategoryState, FetchPaginatedCategories } from '@enterprise/commerce/category-lib/src';

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

  @Select(ManufacturerState.getManufacturers)
  manufacturers: Observable<Manufacturer[]>;

  @Select(CategoryState.getCategories)
  categories: Observable<Category[]>;

  constructor(private store: Store, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.dispatch([FetchPaginatedHotProductsList, FetchPaginatedLatestProductsList, FetchPaginatedManufacturers, FetchPaginatedCategories]);
  }

  onProductCardClicked(item: CatalogItemViewModel) {
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../product-detail', item.catalogId]
    }));
  }
  onCategoryCardClicked(item:Category){
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../product-list/category', item.id]
    }));
  }
  onManufacturerCardClicked(item:Manufacturer){
    this.store.dispatch(new Navigate({
      extras: {
        relativeTo: this.route
      },
      commands: ['../product-list/manufacturer', item.id]
    }));
  }
}
