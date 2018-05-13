import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManufacturerComponent } from './add-manufacturer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ManufacturerService,
  Manufacturer
} from '@enterprise/commerce/catalog-lib';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import {
  ManufacturerState,
  ManufacturersMock,
  AddManufacturer,
  ClearSelectedManufacturer,
  ManufacturerServiceMock
} from '@enterprise/commerce';

describe('AddManufacturerComponent', () => {
  let component: AddManufacturerComponent;
  let fixture: ComponentFixture<AddManufacturerComponent>;
  let store: Store;
  let addManufacturerSpy: jasmine.Spy;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          NgxsModule.forRoot([FileUploadState, ManufacturerState])
        ],
        declarations: [AddManufacturerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [ { provide: ManufacturerService, useValue: ManufacturerServiceMock },]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(Store);
    addManufacturerSpy = spyOn(
      component,
      'onAddNewManufacturer'
    ).and.callThrough();
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('UI Tests', () => { });
  describe('Functional Tests', () => {
    it('should dispatch add manufacturer', () => {
      const manufacturer = ManufacturersMock[0];
      component.onAddNewManufacturer(manufacturer);
      expect(addManufacturerSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalledWith(new AddManufacturer(manufacturer));
    });
    it('should dispatch Clear Selected Manufacturer when on init', () => {
      component.ngOnInit();
      expect(storeSpy).toHaveBeenCalledWith(ClearSelectedManufacturer);
    })
  });
  describe('State Tests', () => {
    describe('Clear Selected Manufacturer and Selected Manufacturer Cleared', () => {
      it('should clean selected manufacturer state when dispatched', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch selected manufacturer cleared when complete', () => {
        expect(false).toBeTruthy();
      })
    })
    describe('Add Manufacturer and Manufacturer Added', () => {
      it('should dispatch register loading overlay when fetch add manufacturer dispatched', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch resolve loading when manufacturer added', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch error occured and resolved overlay loading when error occured', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch manufacturer fetched when complete', () => {
        expect(false).toBeTruthy();
      })
      it('should dispatch navigate and alert on complete', () => {
        expect(false).toBeTruthy();
      })
    })
  })
});
