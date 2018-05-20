import { Component, OnInit } from '@angular/core';
import { Product } from '@enterprise/commerce/catalog-lib';
import { Store, Select } from '@ngxs/store';
import { UpdateProduct, ProductViewModelsMock, FetchSingleProduct, ProductState } from '@enterprise/commerce/product-lib';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({

  selector: 'eca-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
/** TODO: Remove Mock product */
export class EditProductComponent implements OnInit {
  title: string;
  nameSaveButton: string;
  constructor(private store: Store, private route: ActivatedRoute) {
    this.title = 'Edit Product';
    this.nameSaveButton = 'Update';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new FetchSingleProduct(params.get('id')))
    });
  }
  onProductUpdate(product: Product) {
    this.store.dispatch(new UpdateProduct(product));
  }
}
