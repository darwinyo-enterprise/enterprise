import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerCardComponent } from './manufacturer-card.component';
import { BaseTestPage } from '@enterprise/core/testing';
import { ManufacturersMock } from '../mocks/manufacturer-service.mock';
import { Manufacturer } from '@enterprise/commerce/catalog-lib/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class ManufacturerCardComponentPage extends BaseTestPage<ManufacturerCardComponent> {
  constructor(public fixture: ComponentFixture<ManufacturerCardComponent>) {
    super(fixture);
  }
  get card() {
    return this.query<HTMLImageElement>(".card-item");
  }
  get cardImage() {
    return this.query<HTMLImageElement>(".card-item__image > img");
  }
  get cardTitle() {
    return this.query<HTMLElement>('.card-item__title');
  }
}

describe('ManufacturerCardComponent', () => {
  let component: ManufacturerCardComponent;
  let fixture: ComponentFixture<ManufacturerCardComponent>;
  let page: ManufacturerCardComponentPage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturerCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new ManufacturerCardComponentPage(fixture);
  });

  describe('UI Test', () => {
    beforeEach(() => {
      component.manufacturer = ManufacturersMock[0];
      fixture.detectChanges();
    })
    it('should display image correctly', () => {
      expect(page.cardImage.attributes.getNamedItem("src").textContent).toContain(ManufacturersMock[0].imageUrl);
    })
    it('should render name', () => {
      expect(page.cardTitle.textContent).toContain(ManufacturersMock[0].name);
    })
  })
  describe('Functional Test', () => {
    it('should dispatch clicked event when card clicked', () => {
      component.manufacturer = ManufacturersMock[0];
      fixture.detectChanges();
      let viewModel: Manufacturer;
      component.manufacturerCardClicked.subscribe(x => viewModel = x);
      page.card.click();
      expect(viewModel).toBeTruthy(component.manufacturer);
    })
  })
});
