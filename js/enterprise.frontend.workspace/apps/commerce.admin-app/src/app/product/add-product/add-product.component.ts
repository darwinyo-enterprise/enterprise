import { OnInit, Component } from '@angular/core';
import {
  Product,
  ProductService,
  ProductViewModel
} from '@enterprise/commerce/catalog-lib';
import { Store } from '@ngxs/store';
import { AddProduct, ProductViewModelsMock, ClearSelectedProduct } from '@enterprise/commerce/product-lib';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { ClearFileUpload } from '@enterprise/material/file-upload';

@Component({

  selector: 'eca-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  title: string;
  nameSaveButton: string;

  constructor(
    private productService: ProductService,
    private store: Store
  ) {
    this.title = 'Add New Product';
    this.nameSaveButton = 'Add';
  }

  ngOnInit() {
    this.store.dispatch([ClearSelectedProduct, ClearFileUpload]);
  }
  onAddNewProduct(product: ProductViewModel) {
    console.log(product);
    this.store.dispatch(new AddProduct(product));
  }
}
