import { TestBed, inject } from '@angular/core/testing';

import { MaterialGalleryService } from './material-gallery.service';

describe('MaterialGalleryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialGalleryService]
    });
  });

  it('should be created', inject([MaterialGalleryService], (service: MaterialGalleryService) => {
    expect(service).toBeTruthy();
  }));
});
