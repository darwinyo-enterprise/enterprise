import { Component, OnInit } from '@angular/core';
import { Category } from '@enterprise/commerce/catalog-lib';
import { Store, Select } from '@ngxs/store';
import { UpdateCategory, CategoriesMock, FetchSingleCategory, CategoryState } from '@enterprise/commerce/category-lib';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'eca-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
/** TODO: Remove Mock category */
export class EditCategoryComponent implements OnInit {
  title: string;
  nameSaveButton: string;
  constructor(private store: Store, private route: ActivatedRoute) {
    this.title = 'Edit Category';
    this.nameSaveButton = 'Update';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new FetchSingleCategory(params.get('id')))
    });
  }
  onCategoryUpdate(category: Category) {
    this.store.dispatch(new UpdateCategory(category));
  }
}
