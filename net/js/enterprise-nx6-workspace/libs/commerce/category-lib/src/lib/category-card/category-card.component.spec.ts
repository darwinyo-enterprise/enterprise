import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCardComponent } from './category-card.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { CategoriesMock } from '../mocks/category-service.mock';
import { Category } from '@enterprise/commerce/catalog-lib/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class CategoryCardComponentPage extends BaseTestPage<CategoryCardComponent> {
  constructor(public fixture: ComponentFixture<CategoryCardComponent>) {
    super(fixture);
  }
  get card() {
    return this.query<HTMLImageElement>(".card-item--mini");
  }
  get cardImage() {
    return this.query<HTMLImageElement>(".card-item--mini__image > img");
  }
  get cardTitle() {
    return this.query<HTMLElement>('.card-item--mini__title');
  }
}

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;
  let page: CategoryCardComponentPage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new CategoryCardComponentPage(fixture);
  });

  describe('UI Test', () => {
    beforeEach(() => {
      component.category = CategoriesMock[0];
      fixture.detectChanges();
    })
    it('should display image correctly', () => {
      expect(page.cardImage.attributes.getNamedItem("src").textContent).toContain(CategoriesMock[0].imageUrl);
    })
    it('should render name', () => {
      expect(page.cardTitle.textContent).toContain(CategoriesMock[0].name);
    })
  })
  describe('Functional Test', () => {
    it('should dispatch clicked event when card clicked', () => {
      component.category = CategoriesMock[0];
      fixture.detectChanges();
      let viewModel: Category;
      component.categoryCardClicked.subscribe(x => viewModel = x);
      page.card.click();
      expect(viewModel).toBeTruthy(component.category);
    })
  })
});
