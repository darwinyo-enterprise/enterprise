import { TestBed, inject } from '@angular/core/testing';

import { OrderSignalRService } from './signal-r.service';

describe('SignalRService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderSignalRService]
    });
  });

  it('should be created', inject([OrderSignalRService], (service: OrderSignalRService) => {
    expect(service).toBeTruthy();
  }));
});
