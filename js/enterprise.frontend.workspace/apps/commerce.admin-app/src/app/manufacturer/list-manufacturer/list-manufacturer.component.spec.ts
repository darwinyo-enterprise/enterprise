import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManufacturerComponent } from './list-manufacturer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { FileUploadState } from '@enterprise/material/file-upload';
import {
  ManufacturerState,
  FetchSingleManufacturer,
  FetchManufacturers
} from '@enterprise/commerce';
import { ManufacturerService } from '@enterprise/commerce/catalog-lib';

describe('ListManufacturerComponent', () => {
  let component: ListManufacturerComponent;
  let fixture: ComponentFixture<ListManufacturerComponent>;
  let store: Store;
  let storeSpy: jasmine.Spy;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          NgxsModule.forRoot([FileUploadState, ManufacturerState])
        ],
        declarations: [ListManufacturerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [ManufacturerService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });
  describe('UI Tests', () => {});
  describe('Functional Tests', () => {
    it('should dispatch add new manufacturer event when addEvent Triggered', () => {
      expect(false).toBeTruthy();
    });
    it('should dispatch delete manufacturer event when deleteEvent triggered', () => {
      // component.onDeleteManufacturer();
      expect(storeSpy).toHaveBeenCalledWith();
    });
    it('should dispatch fetch manufacturers when component on init', () => {
      component.ngOnInit();
      expect(storeSpy).toHaveBeenCalledWith(new FetchManufacturers());
    });
    it('should dispatch fetch manufacturer when edit button clicked', () => {
      expect(false).toBeTruthy();
    });
  });
});
