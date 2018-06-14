import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialGalleryComponent } from './material-gallery.component';

describe('MaterialGalleryComponent', () => {
  let component: MaterialGalleryComponent;
  let fixture: ComponentFixture<MaterialGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
