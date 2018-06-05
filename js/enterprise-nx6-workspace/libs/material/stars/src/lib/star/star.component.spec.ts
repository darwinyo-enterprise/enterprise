import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarComponent } from './star.component';
import { BaseTestPage } from '@enterprise/core/testing';

export class StarComponentPage extends BaseTestPage<StarComponent> {
  constructor(public fixture: ComponentFixture<StarComponent>) {
    super(fixture);
  }

  get starlit() {
    return this.query<HTMLElement>(".card-item__detail__star-rate__lit");
  }
}

describe('StarComponent', () => {
  let component: StarComponent;
  let fixture: ComponentFixture<StarComponent>;
  let page: StarComponentPage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new StarComponentPage(fixture);
  });

  it('should render correct width star by starWidth Input', () => {
    component.starWidth = 20;
    fixture.detectChanges();
    expect(page.starlit.style.width).toContain('20%');
  });
});
