import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManufacturerComponent } from './list-manufacturer.component';

describe('ListManufacturerComponent', () => {
  let component: ListManufacturerComponent;
  let fixture: ComponentFixture<ListManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListManufacturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
