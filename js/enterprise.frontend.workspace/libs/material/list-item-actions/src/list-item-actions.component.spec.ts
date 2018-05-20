import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ListItemActionsComponent } from "./list-item-actions.component";
import { BaseTestPage } from "@enterprise/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs/observable/of";
import { PaginatedListViewModelItemViewModel100Mocks, PaginatedListViewModelItemViewModel10Mocks } from "@enterprise/material/list-item-actions/src/mocks/list-item-actions.mocks";
import { ChangePagination } from "@enterprise/material/list-item-actions/src/shared/list-item-actions.actions";
import { ListItemActionState } from "@enterprise/material/list-item-actions/src/shared/list-item-actions.state";
import { NgxsModule, Store } from "@ngxs/store";
import { noop } from "rxjs";
import { TdMediaService, IPageChangeEvent } from "@covalent/core";

export class ListItemActionsComponentPage extends BaseTestPage<
  ListItemActionsComponent
  > {
  constructor(public fixture: ComponentFixture<ListItemActionsComponent>) {
    super(fixture);
  }

  get listItemAddButton() {
    return this.query<HTMLButtonElement>("#li-addBtn");
  }

  get title() {
    return this.query<HTMLElement>(".form-card__title");
  }

  get itemAction() {
    return this.queryAll<HTMLElement>(".list-item-actions__item");
  }
}

describe("ListItemActionsComponent",
  () => {
    let component: ListItemActionsComponent;
    let fixture: ComponentFixture<ListItemActionsComponent>;
    const title = "Tests Title";
    const paginatedListViewModelItemViewModelMocks = PaginatedListViewModelItemViewModel10Mocks;
    let store: Store;
    let storeSpy: jasmine.Spy;

    let listItemActionsComponentPage: ListItemActionsComponentPage;
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [NgxsModule.forRoot([ListItemActionState])],
          declarations: [ListItemActionsComponent],
          schemas: [NO_ERRORS_SCHEMA],
          providers: [{
            provide: TdMediaService,
            useValue: {
              registerQuery: noop,
              query: noop,
              broadcast: noop,
              createComponent: noop,
              createReplaceComponent: noop,
              register: noop,
              resolve: noop
            }
          }]
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ListItemActionsComponent);
      component = fixture.componentInstance;
      listItemActionsComponentPage = new ListItemActionsComponentPage(fixture);
      component.title = title;
      component.items$ = of(paginatedListViewModelItemViewModelMocks);
      store = TestBed.get(Store);

      storeSpy = spyOn(store, 'dispatch').and.callThrough();
      fixture.detectChanges();
    });

    describe("UI Tests",
      () => {
        it("should render name item actions properly",
          () => {
            expect(listItemActionsComponentPage.itemAction.length).toBe(
              paginatedListViewModelItemViewModelMocks.listData.length
            );
            expect(listItemActionsComponentPage.itemAction[0].innerHTML).toContain(
              paginatedListViewModelItemViewModelMocks.listData[0].name
            );
            expect(listItemActionsComponentPage.itemAction[3].innerHTML).toContain(
              paginatedListViewModelItemViewModelMocks.listData[3].name
            );
          });
        it("should render title properly",
          () => {
            expect(listItemActionsComponentPage.title.innerText).toEqual(title);
          });
      });
    describe("Functional Tests",
      () => {
        it("should scaffold list",
          () => {
            expect(listItemActionsComponentPage.itemAction.length).toBe(
              paginatedListViewModelItemViewModelMocks.listData.length
            );
          });
        it("should emit right id when button edit clicked",
          () => {
            const editBtn: HTMLButtonElement = listItemActionsComponentPage.itemAction[0].querySelector(
              ".list-item-actions__item__edit > button"
            );

            let editId: string;
            component.editItem.subscribe(x => (editId = x));
            editBtn.click();

            expect(editId).toEqual(paginatedListViewModelItemViewModelMocks.listData[0].id);
          });
        it("should emit right id when delete clicked",
          () => {
            const deleteBtn: HTMLButtonElement = listItemActionsComponentPage.itemAction[0].querySelector(
              ".list-item-actions__item__delete > button"
            );

            let deleteId: string;
            component.deleteItem.subscribe(x => (deleteId = x));
            deleteBtn.click();

            expect(deleteId).toEqual(paginatedListViewModelItemViewModelMocks.listData[0].id);
          });
        it("should emit add new event when button add clicked",
          () => {
            component.addNewItem.subscribe(() => expect(true).toBeTruthy());
            listItemActionsComponentPage.listItemAddButton.click();
          });

        it('should emit pagination changed event when every changes on pagination bar made', () => {
          component.pagingChanged.subscribe(() => expect(true).toBeTruthy());
          component.onPaginationChanged(<IPageChangeEvent>{});
        })

        it('should dispatch change pagination command every changes made', () => {
          const pageInfoMock = <IPageChangeEvent>{
            page: 10,
            pageSize: 10,
            maxPage: 10,
            total: 10,
            toRow: 10,
            fromRow: 10
          };
          component.onPaginationChanged(pageInfoMock);
          expect(store.dispatch).toHaveBeenCalledWith(new ChangePagination(pageInfoMock));
        })

      });
  });
