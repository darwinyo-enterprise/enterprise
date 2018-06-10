import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterComponent } from './counter.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { FormsModule } from '@angular/forms';

export class CounterPage extends BaseTestPage<
  CounterComponent
  > {
  constructor(public fixture: ComponentFixture<CounterComponent>) {
    super(fixture);
  }
  get addBtn() {
    return this.query<HTMLButtonElement>('#add-quantity');
  }
  get removeBtn() {
    return this.query<HTMLButtonElement>('#remove-quantity');
  }
  get quantityInput() {
    return this.query<HTMLInputElement>('.product-detail-action__counter__input');
  }
}

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let page: CounterPage;
  let inputSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new CounterPage(fixture);
    inputSpy = spyOn(component, 'valueChanged').and.callThrough();
  });
  describe('Functional Test', () => {
    it('should add 1 to quantity textbox and emit value changed event', () => {
      let counterValue: number = null;
      component.maxOrder = 3;
      component.counterChanged.subscribe(x => counterValue = x);
      const quantity = component.value;
      page.addBtn.click();
      fixture.detectChanges();
      expect(component.value).toBe(quantity + 1);
      expect(counterValue).not.toBeNull();
    })
    it('should remove 1 to quantity textbox and emit value changed event', () => {
      let counterValue: number = null;
      component.maxOrder = 3;
      component.counterChanged.subscribe(x => counterValue = x);
      page.addBtn.click();
      fixture.detectChanges();
      const quantity = component.value;
      page.removeBtn.click();
      expect(component.value).toBe(quantity - 1);

      expect(counterValue).not.toBeNull();
    })
    it('should be unable to decrease 1 and else than 1 when remove clicked', () => {
      let counterValue: number = null;
      component.maxOrder = 3;
      component.counterChanged.subscribe(x => counterValue = x);
      const quantity = component.value;
      expect(component.value).toBe(1);
      page.removeBtn.click();
      expect(component.value).toBe(1);

      expect(counterValue).not.toBeNull();
    })
    it('should unable to add quantity when maxOrder equal or bigger than defined', () => {
      component.maxOrder = 3;

      let counterValue: number = null;
      component.counterChanged.subscribe(x => counterValue = x);
      const quantity = component.value;
      expect(component.value).toBe(1);
      page.addBtn.click();
      expect(component.value).toBe(2);
      page.addBtn.click();
      expect(component.value).toBe(3);
      page.addBtn.click();
      expect(component.value).toBe(3);

      expect(counterValue).not.toBeNull();
    })
    it('should set to max Order when value input bigger than max order', () => {
      component.maxOrder = 3;

      let counterValue: number = null;
      component.counterChanged.subscribe(x => counterValue = x);
      component.value = 23;
      component.valueChanged();
      expect(component.value).toBe(3);
      expect(counterValue).not.toBeNull();
    })
  })
  describe('UI Test', () => {

  })
});
