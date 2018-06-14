import { async, TestBed } from '@angular/core/testing';
import { MaterialStarsModule } from './material-stars.module';

describe('MaterialStarsModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [MaterialStarsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(MaterialStarsModule).toBeDefined();
  });
});
