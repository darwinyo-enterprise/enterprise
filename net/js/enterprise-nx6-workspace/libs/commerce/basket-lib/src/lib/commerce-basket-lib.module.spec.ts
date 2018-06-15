import { async, TestBed } from '@angular/core/testing';
import { CommerceBasketLibModule } from './commerce-basket-lib.module';

describe('CommerceBasketLibModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [CommerceBasketLibModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CommerceBasketLibModule).toBeDefined();
  });
});
