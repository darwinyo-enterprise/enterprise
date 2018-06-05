import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarContainerComponent } from './star-container.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class StarContainerComponentPage extends BaseTestPage<StarContainerComponent> {
  constructor(public fixture: ComponentFixture<StarContainerComponent>) {
    super(fixture);
  }

  get stars() {
    return this.queryAll<HTMLElement>("em-star");
  }
  get rate_count() {
    return this.query<HTMLElement>('.card-item__detail__star-rate__rate-count');
  }
}

describe('StarContainerComponent', () => {
  let component: StarContainerComponent;
  let fixture: ComponentFixture<StarContainerComponent>;
  let page: StarContainerComponentPage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StarContainerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new StarContainerComponentPage(fixture);
  });

  describe('Functionality test', () => {
    it('should populate correct star rate', () => {
      expect(component.starWidths.length).toBe(0);
      component.rate = 3.65;
      component.calculateStarRate();
      const expected = [100, 100, 100, 65, 0];
      expect(component.starWidths[0]).toBe(expected[0]);
      expect(component.starWidths[1]).toBe(expected[1]);
      expect(component.starWidths[2]).toBe(expected[2]);
      expect(component.starWidths[3]).toBe(expected[3]);
      expect(component.starWidths[4]).toBe(expected[4]);
    })
  })
  describe('UI Test', () => {
    it('should populate stars', () => {
      component.rate = 3.65;
      component.calculateStarRate();
      fixture.detectChanges();
      expect(page.stars.length).toBe(component.starWidths.length);
    })
    it('should render correct rate count', () => {
      component.rate = 4.95;
      fixture.detectChanges();
      expect(page.rate_count.innerHTML).toContain(component.rate.toString());
    })
  })
});
