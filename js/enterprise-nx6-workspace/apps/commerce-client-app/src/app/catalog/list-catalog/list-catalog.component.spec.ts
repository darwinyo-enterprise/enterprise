import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogComponent } from './list-catalog.component';

describe('ListCatalogComponent', () => {
  let component: ListCatalogComponent;
  let fixture: ComponentFixture<ListCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
