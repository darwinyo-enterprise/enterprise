import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Category } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'eca-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {
  @Input()
  /** category view model */
  category: Category;

  @Output()
  /** category clicked event */
  categoryCardClicked: EventEmitter<Category>;

  constructor() {
    this.categoryCardClicked = new EventEmitter<Category>();
  }

  ngOnInit() {
  }
  onCategoryCardClicked() {
    this.categoryCardClicked.emit(this.category);
  }
}
