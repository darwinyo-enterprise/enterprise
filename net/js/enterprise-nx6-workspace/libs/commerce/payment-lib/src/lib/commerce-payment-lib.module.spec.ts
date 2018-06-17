import { async, TestBed } from '@angular/core/testing';
import { CommercePaymentLibModule } from './commerce-payment-lib.module';

describe('CommercePaymentLibModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [CommercePaymentLibModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CommercePaymentLibModule).toBeDefined();
  });
});
