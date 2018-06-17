import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListCategoryComponent } from './list-category.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store, StateContext } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import { CategoryService, Category, PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { categoryRoutes } from '../category-routing.module';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { Location } from "@angular/common";
import { Navigate, RegisterLoadingOverlay, Confirm } from '@enterprise/core';
import { CategoryStateModel, CategoriesMock, CategoryState, DeleteCategory, FetchCategories, FetchPaginatedCategoriesList } from '@enterprise/commerce/category-lib';
import { Observable } from 'rxjs';
import { PaginatedCategoriesMock } from '@enterprise/commerce/category-lib';
import { IPageChangeEvent } from '@covalent/core';
import { take } from 'rxjs/operators';
import { ChangePagination } from '@enterprise/material/list-item-actions';

describe('ListCategoryComponent', () => {
  let component: ListCategoryComponent;
  let fixture: ComponentFixture<ListCategoryComponent>;
  let store: Store;
  let storeSpy: jasmine.Spy;
  let router: Router;
  let route: ActivatedRoute;
  let location: Location;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          RouterTestingModule.withRoutes(categoryRoutes),
          NgxsModule.forRoot([FileUploadState, CategoryState])
        ],
        declarations: [
          ListCategoryComponent,
          AddCategoryComponent,
          EditCategoryComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: CategoryService, useValue: {
              configuration: {
                accessToken: ''
              },
              apiV1CategoryListGet(): Observable<PaginatedListViewModelItemViewModel> {

                return of(PaginatedCategoriesMock);
              }
            }
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ id: 123 })
            }
          }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    route = TestBed.get(ActivatedRoute);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
    router.initialNavigation();
  });

  describe('UI Tests', () => {
  });

  describe('Functional Tests', () => {
    it('should dispatch navigate event to add when addEvent Triggered', () => {
      component.onAddNewCategory();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate({
        extras: {
          relativeTo: route
        },
        commands: ['../add']
      }))
    });

    it('should dispatch confirm event when deleteEvent triggered', () => {
      component.onDeleteCategory('1');
      expect(store.dispatch).toHaveBeenCalledWith(new Confirm(component.confirmModel, component.deleteSubject$));
    });

    it('should dispatch delete category event when confirmed event triggered is true', () => {
      component.onDeleteCategory('1');
      component.deleteSubject$.next(true);
      expect(store.dispatch).toHaveBeenCalledWith(new DeleteCategory('1'));
    });

    it('should dispatch fetch first paginated categories when component on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(new FetchPaginatedCategoriesList({ page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 }));
    });

    it('should dispatch fetch paginated categories when pagination changed', () => {
      const pageInfo: IPageChangeEvent = { page: 1, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 };

      component.onPaginationChanged();
      component.pageInfo$.pipe(take(1)).subscribe(x => {
        expect(store.dispatch).toHaveBeenCalledWith(new FetchPaginatedCategoriesList(x));
      })

      store.dispatch(new ChangePagination(pageInfo));
    });
  });
});
