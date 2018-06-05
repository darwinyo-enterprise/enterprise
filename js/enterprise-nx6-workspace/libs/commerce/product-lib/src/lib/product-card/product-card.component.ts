import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CatalogItemViewModel } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'eca-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input()
  /** product view model contains all view info */
  productViewModel: CatalogItemViewModel;

  @Output()
  /**when product card clicked event */
  productCardClicked: EventEmitter<CatalogItemViewModel>;

  constructor() {
    this.productCardClicked = new EventEmitter<CatalogItemViewModel>();
  }

  ngOnInit() {
  }

  onProductCardClicked() {
    this.productCardClicked.emit(this.productViewModel);
  }
}
