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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { manufacturerRoutes } from '../manufacturer-routing.module';
import { ListManufacturerComponent } from '../list-manufacturer/list-manufacturer.component';
import { AddManufacturerComponent } from '../add-manufacturer/add-manufacturer.component';

describe('EditManufacturerComponent', () => {
  let component: EditManufacturerComponent;
  let fixture: ComponentFixture<EditManufacturerComponent>;
  let store: Store;
  let editManufacturerSpy: jasmine.Spy;
  let storeSpy: jasmine.Spy;

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
          EditManufacturerComponent],
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
    fixture = TestBed.createComponent(EditManufacturerComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
    editManufacturerSpy = spyOn(
      component,
      'onManufacturerUpdate'
    ).and.callThrough();
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });
  describe('UI Tests', () => { });
  describe('Functional Tests', () => {
    it('should dispatch update manufacturer', () => {
      const manufacturer = ManufacturersMock[0];
      component.onManufacturerUpdate(manufacturer);
      expect(editManufacturerSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalledWith(
        new UpdateManufacturer(manufacturer)
      );
    });
  });
});
