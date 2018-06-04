import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListManufacturerComponent } from './list-manufacturer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store, StateContext } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import {
  ManufacturerState,
  FetchSingleManufacturer,
  FetchManufacturers,
  AddManufacturer,
  DeleteManufacturer
} from '@enterprise/commerce';
import { ManufacturerService, Manufacturer, PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { manufacturerRoutes } from '../manufacturer-routing.module';
import { AddManufacturerComponent } from '../add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from '../edit-manufacturer/edit-manufacturer.component';
import { Location } from "@angular/common";
import { Navigate, RegisterLoadingOverlay, Confirm } from '@enterprise/core';
import { ManufacturerStateModel, ManufacturersMock, FetchPaginatedManufacturersList, PaginatedManufacturersListFetched } from '@enterprise/commerce/manufacturer-lib';
import { Observable } from 'rxjs';
import { ChangePagination } from '@enterprise/material/list-item-actions';
import { IPageChangeEvent } from '@covalent/core';
import { timeout, take } from 'rxjs/operators';
import { PaginatedManufacturersMock } from '@enterprise/commerce/manufacturer-lib/src/mocks/manufacturer-service.mock';

describe('ListManufacturerComponent', () => {
  let component: ListManufacturerComponent;
  let fixture: ComponentFixture<ListManufacturerComponent>;
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
          RouterTestingModule.withRoutes(manufacturerRoutes),
          NgxsModule.forRoot([FileUploadState, ManufacturerState])
        ],
        declarations: [
          ListManufacturerComponent,
          AddManufacturerComponent,
          EditManufacturerComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: ManufacturerService, useValue: {
              apiV1ManufacturerListGet(): Observable<PaginatedListViewModelItemViewModel> {

                return of(PaginatedManufacturersMock);
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
    fixture = TestBed.createComponent(ListManufacturerComponent);
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
      component.onAddNewManufacturer();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate({
        extras: {
          relativeTo: route
        },
        commands: ['../add']
      }))
    });

    it('should dispatch confirm event when deleteEvent triggered', () => {
      component.onDeleteManufacturer('1');
      expect(store.dispatch).toHaveBeenCalledWith(new Confirm(component.confirmModel, component.deleteSubject$));
    });

    it('should dispatch delete manufacturer event when confirmed event triggered is true', () => {
      component.onDeleteManufacturer('1');
      component.deleteSubject$.next(true);
      expect(store.dispatch).toHaveBeenCalledWith(new DeleteManufacturer('1'));
    });

    it('should dispatch fetch first paginated manufacturers when component on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(new FetchPaginatedManufacturersList({ page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 }));
    });

    it('should dispatch fetch paginated manufacturers when pagination changed', () => {
      var pageInfo: IPageChangeEvent = { page: 1, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0 };

      component.onPaginationChanged();
      component.pageInfo$.pipe(take(1)).subscribe(x => {
        expect(store.dispatch).toHaveBeenCalledWith(new FetchPaginatedManufacturersList(x));
      })

      store.dispatch(new ChangePagination(pageInfo));
    });
  });
});
