import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManufacturerComponent } from './edit-manufacturer.component';
import { Store, NgxsModule } from '@ngxs/store';
import {
  Manufacturer,
  ManufacturerService
} from '@enterprise/commerce/catalog-lib';
import {
  ManufacturersMock,
  UpdateManufacturer,
  ManufacturerState,
  SingleManufacturerFetched,
  FetchSingleManufacturer
} from '@enterprise/commerce';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadState } from '@enterprise/material/file-upload';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { manufacturerRoutes } from '../manufacturer-routing.module';
import { ListManufacturerComponent } from '../list-manufacturer/list-manufacturer.component';
import { AddManufacturerComponent } from '../add-manufacturer/add-manufacturer.component';
import { Observable } from 'rxjs';

describe('EditManufacturerComponent', () => {
  let component: EditManufacturerComponent;
  let fixture: ComponentFixture<EditManufacturerComponent>;
  let store: Store;
  let storeSpy: jasmine.Spy;
  let service: ManufacturerService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          NgxsModule.forRoot([FileUploadState, ManufacturerState])
        ],
        declarations: [
          EditManufacturerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: ManufacturerService, useValue: {
              apiV1ManufacturerByIdPut(): Observable<any> {
                return of();
              },
              apiV1ManufacturerByIdGet(id: number) {
                return of(ManufacturersMock.filter(x => x.id === id)[0]);
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
    fixture = TestBed.createComponent(EditManufacturerComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    service = TestBed.get(ManufacturerService);
    storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
    fixture.detectChanges();
  });
  describe('UI Tests', () => { });
  describe('Functional Tests', () => {
    it('should dispatch update manufacturer', () => {
      const manufacturer = ManufacturersMock[0];
      component.onManufacturerUpdate(manufacturer);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateManufacturer(manufacturer));
    })
    it('should dispatch fetch single manufacturer on init', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalled();
    })
  });
  // describe('State Tests', () => {
  //   describe('Update Manufacturer and Manufacturer Updated', () => {
  //     it('should dispatch register loading overlay when dispatched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch resolve loading when update manufacturer fetched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch error occured and resolved overlay loading when error occured', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch manufacturer fetched when complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch navigate and alert on complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //   })
  //   describe('Fetch Single Manufacturer and Single Manufacturer Fetched', () => {
  //     it('should dispatch register loading overlay when fetch single manufacturer dispatched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch resolve loading when single manufacturer fetched', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should patch state to manufacturer state on success case', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch error occured and resolved overlay loading when error occured', () => {
  //       expect(false).toBeTruthy();
  //     })
  //     it('should dispatch manufacturer fetched when complete', () => {
  //       expect(false).toBeTruthy();
  //     })
  //   })
  // })
});
