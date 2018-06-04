import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCatalogComponent } from './detail-catalog.component';

describe('DetailCatalogComponent', () => {
  let component: DetailCatalogComponent;
  let fixture: ComponentFixture<DetailCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
