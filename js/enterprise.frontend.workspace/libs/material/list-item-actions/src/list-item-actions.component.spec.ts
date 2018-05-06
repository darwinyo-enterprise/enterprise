import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemActionsComponent } from './list-item-actions.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ListItemActionsMocks } from './mocks/list-item-actions.mocks';
import { of } from 'rxjs/observable/of';

export class ListItemActionsComponentPage extends BaseTestPage<
  ListItemActionsComponent
> {
  constructor(public fixture: ComponentFixture<ListItemActionsComponent>) {
    super(fixture);
  }
  get listItemAddButton() {
    return this.query<HTMLButtonElement>('#li-addBtn');
  }
  get title() {
    return this.query<HTMLElement>('.form-card__title');
  }
  get itemAction() {
    return this.queryAll<HTMLElement>('.list-item-actions__item');
  }
}

describe('ListItemActionsComponent', () => {
  let component: ListItemActionsComponent;
  let fixture: ComponentFixture<ListItemActionsComponent>;
  const title = 'Tests Title';
  const listItemActionsMocks = ListItemActionsMocks;
  let listItemActionsComponentPage: ListItemActionsComponentPage;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ListItemActionsComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemActionsComponent);
    component = fixture.componentInstance;
    listItemActionsComponentPage = new ListItemActionsComponentPage(fixture);
    component.title = title;
    component.items$ = of(listItemActionsMocks);
    fixture.detectChanges();
  });

  describe('UI Tests', () => {
    it('should render name item actions properly', () => {
      expect(listItemActionsComponentPage.itemAction.length).toBe(
        listItemActionsMocks.length
      );
      expect(listItemActionsComponentPage.itemAction[0].innerHTML).toContain(
        listItemActionsMocks[0].name
      );
      expect(listItemActionsComponentPage.itemAction[3].innerHTML).toContain(
        listItemActionsMocks[3].name
      );
    });
    it('should render title properly', () => {
      expect(listItemActionsComponentPage.title.innerText).toEqual(title);
    });
  });
  describe('Functional Tests', () => {
    it('should scaffold list', () => {
      expect(listItemActionsComponentPage.itemAction.length).toBe(
        listItemActionsMocks.length
      );
    });
    it('should emit right id when button edit clicked', () => {
      const editBtn: HTMLButtonElement = listItemActionsComponentPage.itemAction[0].querySelector(
        '.list-item-actions__item__edit > button'
      );

      let editId: string;
      component.editItem.subscribe(x => (editId = x));
      editBtn.click();

      expect(editId).toEqual(listItemActionsMocks[0].id);
    });
    it('should emit right id when delete clicked', () => {
      const deleteBtn: HTMLButtonElement = listItemActionsComponentPage.itemAction[0].querySelector(
        '.list-item-actions__item__delete > button'
      );

      let deleteId: string;
      component.deleteItem.subscribe(x => (deleteId = x));
      deleteBtn.click();

      expect(deleteId).toEqual(listItemActionsMocks[0].id);
    });
    it('should emit add new event when button add clicked', () => {
      component.addNewItem.subscribe(() => expect(true).toBeTruthy());
      listItemActionsComponentPage.listItemAddButton.click();
    });
  });
});
