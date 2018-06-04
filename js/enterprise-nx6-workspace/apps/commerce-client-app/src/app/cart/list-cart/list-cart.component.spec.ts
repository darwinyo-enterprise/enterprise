import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCartComponent } from './list-cart.component';

describe('ListCartComponent', () => {
  let component: ListCartComponent;
  let fixture: ComponentFixture<ListCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
