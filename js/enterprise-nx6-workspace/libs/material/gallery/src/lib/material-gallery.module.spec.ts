
import { async, TestBed } from '@angular/core/testing';
import { MaterialGalleryModule } from './material-gallery.module';

describe('MaterialGalleryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialGalleryModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(MaterialGalleryModule).toBeDefined();
  });
});
      