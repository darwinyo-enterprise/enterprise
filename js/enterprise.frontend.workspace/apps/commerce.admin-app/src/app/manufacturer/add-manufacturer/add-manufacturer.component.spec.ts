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
  AddManufacturer
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
        providers: [ManufacturerService]
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

  describe('UI Tests', () => {});
  describe('Functional Tests', () => {
    it('should be empty manufacturer input', () => {
      expect(component.manufacturer).toEqual(<Manufacturer>{});
    });
    it('should dispatch add manufacturer', () => {
      const manufacturer = ManufacturersMock[0];
      component.onAddNewManufacturer(manufacturer);
      expect(addManufacturerSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalledWith(new AddManufacturer(manufacturer));
    });
  });
});
