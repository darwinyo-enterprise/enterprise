import { OnInit, Component } from '@angular/core';
import {
  Category,
  CategoryService
} from '@enterprise/commerce/catalog-lib';
import { Store } from '@ngxs/store';
import { AddCategory, CategoriesMock, ClearSelectedCategory } from '@enterprise/commerce/category-lib';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { ClearFileUpload } from '@enterprise/material/file-upload';

@Component({

  selector: 'eca-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  title: string;
  nameSaveButton: string;

  constructor(
    private categoryService: CategoryService,
    private store: Store
  ) {
    this.title = 'Add New Category';
    this.nameSaveButton = 'Add';
  }

  ngOnInit() {
    this.store.dispatch([ClearSelectedCategory, ClearFileUpload]);
  }
  onAddNewCategory(category: Category) {
    // mock id. though it will be decided on server.
    // API Cant get model properly if id is null
    category.id = 1;
    this.store.dispatch(new AddCategory(category));
  }
}
