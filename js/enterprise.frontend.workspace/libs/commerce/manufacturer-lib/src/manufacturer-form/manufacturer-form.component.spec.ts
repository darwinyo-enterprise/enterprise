import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerFormComponent } from './manufacturer-form.component';

describe('ManufacturerFormComponent', () => {
  let component: ManufacturerFormComponent;
  let fixture: ComponentFixture<ManufacturerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
