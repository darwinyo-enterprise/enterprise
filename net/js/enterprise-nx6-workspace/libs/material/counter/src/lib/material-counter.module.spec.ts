import { async, TestBed } from '@angular/core/testing';
import { MaterialCounterModule } from './material-counter.module';

describe('MaterialCounterModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [MaterialCounterModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(MaterialCounterModule).toBeDefined();
  });
});
