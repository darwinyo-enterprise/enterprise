import { OnInit, Component } from '@angular/core';
import {
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
    private store: Store
  ) {
    this.title = 'Add New Product';
    this.nameSaveButton = 'Add';
  }

  ngOnInit() {
    this.store.dispatch([ClearSelectedProduct, ClearFileUpload]);
  }
  onAddNewProduct(product: ProductViewModel) {
    // this can help to eliminate null object in server side
    product.id = '1';
    product.actorId = '1';
    this.store.dispatch(new AddProduct(product));
  }
}
