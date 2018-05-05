import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManufacturerComponent } from './edit-manufacturer.component';
import { Store, NgxsModule } from '@ngxs/store';
import { Manufacturer, ManufacturerService } from '@enterprise/commerce/catalog-lib';
import { ManufacturersMock, UpdateManufacturer, ManufacturerState, SingleManufacturerFetched } from '@enterprise/commerce';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadState } from '@enterprise/material/file-upload';

describe('EditManufacturerComponent', () => {
  let component: EditManufacturerComponent;
  let fixture: ComponentFixture<EditManufacturerComponent>;
  let store: Store;
  let editManufacturerSpy: jasmine.Spy;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, NgxsModule.forRoot([FileUploadState, ManufacturerState])],
        declarations: [EditManufacturerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [ManufacturerService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManufacturerComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
    editManufacturerSpy = spyOn(component, 'onManufacturerUpdate').and.callThrough();
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });
  describe('UI Tests', () => {
  })
  describe('Functional Tests', () => {
    it('should be empty manufacturer input', () => {
      store.dispatch(new SingleManufacturerFetched(ManufacturersMock[0]));
      component.manufacturer$.subscribe(x => {
        expect(x).toEqual(ManufacturersMock[0]);
      })
    })
    it('should dispatch update manufacturer', () => {
      let manufacturer = ManufacturersMock[0];
      component.onManufacturerUpdate(manufacturer);
      expect(editManufacturerSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalledWith(new UpdateManufacturer(manufacturer));
    })
  })
});
