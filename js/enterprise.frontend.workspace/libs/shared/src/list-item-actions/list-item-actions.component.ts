import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListItemModel } from '../models/list-item.model';
import { Observable } from 'rxjs/Observable';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'es-list-item-actions',
  templateUrl: './list-item-actions.component.html',
  styleUrls: ['./list-item-actions.component.scss']
})
export class ListItemActionsComponent implements OnInit {
  @Input() title: string;
  @Input() items$: Observable<ListItemModel[]>;

  /** Edit Item Event */
  @Output() editItem: EventEmitter<string>;

  /** Delete Item Event */
  @Output() deleteItem: EventEmitter<string>;

  /** Add New Item Event */
  @Output() addNewItem: EventEmitter<null>;

  constructor() {
    this.editItem = new EventEmitter<string>();
    this.deleteItem = new EventEmitter<string>();
    this.addNewItem = new EventEmitter<null>();
  }

  ngOnInit() {}

  onEdit(id: string) {
    this.editItem.emit(id);
  }

  onDelete(id: string) {
    this.deleteItem.emit(id);
  }

  onAddNew() {
    this.addNewItem.emit();
  }
}
