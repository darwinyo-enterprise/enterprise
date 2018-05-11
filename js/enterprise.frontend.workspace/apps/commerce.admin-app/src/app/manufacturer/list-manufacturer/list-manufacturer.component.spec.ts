import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListManufacturerComponent } from './list-manufacturer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import {
  ManufacturerState,
  FetchSingleManufacturer,
  FetchManufacturers,
  AddManufacturer,
  DeleteManufacturer
} from '@enterprise/commerce';
import { ManufacturerService } from '@enterprise/commerce/catalog-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { manufacturerRoutes } from '../manufacturer-routing.module';
import { AddManufacturerComponent } from '../add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from '../edit-manufacturer/edit-manufacturer.component';
import { Location } from "@angular/common";
import { Navigate, RegisterLoadingOverlay, Confirm } from '@enterprise/core';

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
          ManufacturerService,
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
    store = TestBed.get(Store);
    location = TestBed.get(Location);
    route = TestBed.get(ActivatedRoute);

    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    router.initialNavigation();
  });

  describe('UI Tests', () => {
  });

  describe('Functional Tests', () => {
    it('should dispatch navigate event to add when addEvent Triggered', () => {
      component.onAddNewManufacturer();
      expect(storeSpy).toHaveBeenCalledWith(new Navigate({
        extras: {
          relativeTo: route
        },
        commands: ['../add']
      }))
    });

    it('should dispatch confirm event when deleteEvent triggered', () => {
      component.onDeleteManufacturer('1');
      expect(storeSpy).toHaveBeenCalledWith(new Confirm(component.confirmModel, component.deleteSubject$));
    });

    it('should dispatch delete manufacturer event when confirmed event triggered is true', () => {
      component.onDeleteManufacturer('1');
      component.deleteSubject$.next(true);
      expect(storeSpy).toHaveBeenCalledWith(new DeleteManufacturer('1'));
    });

    it('should dispatch fetch manufacturers when component on init', () => {
      component.ngOnInit();
      expect(storeSpy).toHaveBeenCalledWith(new FetchManufacturers());
    });

    it('should dispatch fetch manufacturer when edit button clicked', () => {
      component.onEditManufacturer('1');

      expect(storeSpy).toHaveBeenCalledWith([new RegisterLoadingOverlay(), new Navigate({
        extras: {
          relativeTo: route
        },
        commands: ['../edit', '1']
      })])
    });
  });
  describe('State Tests', () => {
    describe('Fetch Manufacturers And Manufacturers Fetched', () => {
      it('should dispatch register overlay when fetch manufacturer', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch resolve overlay when fetch manufacturer done', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch error occured when fetch manufacturer error', () => {
        expect(false).toBeTruthy();
      })
      it('should display error correctly when fetch manufacturer error', () => {
        expect(false).toBeTruthy();
      })
      it('should patch manufacturer state when manufacturer fetched', () => {
        expect(false).toBeTruthy();
      })
    })
    describe('Delete Manufacturer and Manufacturer Deleted', () => {
      it('should dispatch register overlay when delete manufacturer', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch resolve overlay when delete manufacturer done', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch error occured when delete manufacturer error', () => {
        expect(false).toBeTruthy();
      })
      it('should display error correctly when delete manufacturer error', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch fetch manufacturer when manufacturer deleted', () => {
        expect(false).toBeTruthy();
      })
    })
  })
});
