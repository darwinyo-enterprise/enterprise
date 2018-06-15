import { async, TestBed } from '@angular/core/testing';
import { CommerceOrderLibModule } from './commerce-order-lib.module';

describe('CommerceOrderLibModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [CommerceOrderLibModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CommerceOrderLibModule).toBeDefined();
  });
});
