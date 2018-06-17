import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryComponent } from './edit-category.component';
import { Store, NgxsModule } from '@ngxs/store';
import {
  Category,
  CategoryService
} from '@enterprise/commerce/catalog-lib';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadState } from '@enterprise/material/file-upload';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { categoryRoutes } from '../category-routing.module';
import { ListCategoryComponent } from '../list-category/list-category.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { Observable } from 'rxjs';
import { CategoryState, CategoriesMock, UpdateCategory } from '@enterprise/commerce/category-lib';

describe('EditCategoryComponent', () => {
  let component: EditCategoryComponent;
  let fixture: ComponentFixture<EditCategoryComponent>;
  let store: Store;
  let storeSpy: jasmine.Spy;
  let service: CategoryService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          NgxsModule.forRoot([FileUploadState, CategoryState])
        ],
        declarations: [
          EditCategoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: CategoryService, useValue: {
              configuration: {
                accessToken: ''
              },
              apiV1CategoryByIdPut(): Observable<any> {
                return of();
              },
              apiV1CategoryByIdGet(id: number) {
                return of(CategoriesMock.filter(x => x.id === id)[0]);
              }
            }
          },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(convertToParamMap({ id: 1 })) }
          }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    service = TestBed.get(CategoryService);
    storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
    fixture.detectChanges();
  });
  describe('UI Tests', () => { });
  describe('Functional Tests', () => {
    it('should dispatch update category', () => {
      const category = CategoriesMock[0];
      component.onCategoryUpdate(category);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateCategory(category));
    })
    it('should dispatch fetch single category on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalled();
    })
  });
  // describe('State Tests', () => {
  //   describe('Update Category and Category Updated', () => {
  //     it('should dispatch register loading overlay when dispatched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch resolve loading when update category fetched', () => {
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
  //   describe('Fetch Single Category and Single Category Fetched', () => {
  //     it('should dispatch register loading overlay when fetch single category dispatched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch resolve loading when single category fetched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should patch state to category state on success case', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch error occured and resolved overlay loading when error occured', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch category fetched when complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //   })
  // })
});
