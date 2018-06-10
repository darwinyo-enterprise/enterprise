import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'em-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  @Output()
  counterChanged: EventEmitter<number>;

  @ViewChild('quantity')
  counterTextbox: HTMLInputElement;

  @Input()
  maxOrder: number;

  value = 1;

  constructor() {
    this.counterChanged = new EventEmitter();
  }

  ngOnInit() {
  }
  addQuantity() {
    if (this.maxOrder > this.value) {
      this.value += 1;
    }

    this.valueChanged();
  }

  removeQuantity() {
    this.value -= 1;
    this.valueChanged();
  }
  valueChanged() {
    if (this.value <= 1) {
      this.value = 1;
    } else if (this.value > this.maxOrder) {
      this.value = this.maxOrder;
    }

    this.counterChanged.emit(this.value);
  }
}
