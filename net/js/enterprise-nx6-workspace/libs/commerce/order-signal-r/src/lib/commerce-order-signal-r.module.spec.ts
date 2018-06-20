import { async, TestBed } from '@angular/core/testing';
import { CommerceOrderSignalRModule } from './commerce-order-signal-r.module';

describe('CommerceOrderSignalRModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [CommerceOrderSignalRModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CommerceOrderSignalRModule).toBeDefined();
  });
});
