import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI Tests', () => {
    it('should display image correctly', () => {
      expect(false).toBeTruthy();
    })
    it('should render name', () => {
      expect(false).toBeTruthy();
    })
    it('should render star rate', () => {
      expect(false).toBeTruthy();
    })
    it('should render price', () => {
      expect(false).toBeTruthy();
    })
    it('should render rating', () => {
      expect(false).toBeTruthy();
    })
    it('should render favorite', () => {
      expect(false).toBeTruthy();
    })
    it('should render reviewer count', () => {
      expect(false).toBeTruthy();
    })

  })
  describe('Functionality Tests', () => {
    it('should dispatch navigate to product detail when card clicked', () => {
      expect(false).toBeTruthy();
    })
  })
});
