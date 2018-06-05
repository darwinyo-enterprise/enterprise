import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'eca-manufacturer-card',
  templateUrl: './manufacturer-card.component.html',
  styleUrls: ['./manufacturer-card.component.scss']
})
export class ManufacturerCardComponent implements OnInit {
  @Input()
  /** manufacturer view model */
  manufacturer: Manufacturer;

  @Output()
  /** manufacturer clicked event */
  manufacturerCardClicked: EventEmitter<Manufacturer>;

  constructor() {
    this.manufacturerCardClicked = new EventEmitter<Manufacturer>();
  }

  ngOnInit() {
  }
  onManufacturerCardClicked() {
    this.manufacturerCardClicked.emit(this.manufacturer);
  }
}
