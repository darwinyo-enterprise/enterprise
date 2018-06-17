import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryComponent } from './add-category.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  CategoryService,
  Category
} from '@enterprise/commerce/catalog-lib';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState, ClearFileUpload } from '@enterprise/material/file-upload';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { CategoryState, CategoriesMock, AddCategory, ClearSelectedCategory } from '@enterprise/commerce/category-lib';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let store: Store;
  let addCategorySpy: jasmine.Spy;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          NgxsModule.forRoot([FileUploadState, CategoryState])
        ],
        declarations: [AddCategoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{
          provide: CategoryService, useValue: {
            configuration: {
              accessToken: ''
            },
            apiV1CategoryPost(): Observable<any> {

              return of();
            }
          }
        },]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(Store);
    addCategorySpy = spyOn(
      component,
      'onAddNewCategory'
    ).and.callThrough();
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('UI Tests', () => { });
  describe('Functional Tests', () => {
    it('should dispatch add category', () => {
      const category = CategoriesMock[0];
      component.onAddNewCategory(category);
      expect(component.onAddNewCategory).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(new AddCategory(category));
    });
    it('should dispatch Clear Selected Category, and clear file upload when on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith([ClearSelectedCategory, ClearFileUpload]);
    })
  });
  // describe('State Tests', () => {
  //   describe('Clear Selected Category and Selected Category Cleared', () => {
  //     it('should clean selected category state when dispatched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch selected category cleared when complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //   })
  //   describe('Add Category and Category Added', () => {
  //     it('should dispatch register loading overlay when fetch add category dispatched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch resolve loading when category added', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch error occured and resolved overlay loading when error occured', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch category fetched when complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch navigate and alert on complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //   })
  // })
});
