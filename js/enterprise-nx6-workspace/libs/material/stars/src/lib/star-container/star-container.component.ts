import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'em-star-container',
  templateUrl: './star-container.component.html',
  styleUrls: ['./star-container.component.scss']
})
export class StarContainerComponent implements OnInit {
  /** Rating Score */
  @Input()
  rate: number;

  /**Rate Count */
  @Input()
  rateCount: number;

  starWidths: number[];
  constructor() {
    this.starWidths = [];
  }

  ngOnInit() {
    this.calculateStarRate();
  }

  /** used for calculate star rate */
  calculateStarRate() {
    if (this.rate !== undefined) {
      let rates = this.rate * 100;
      for (let index = 0; index < 5; index++) {
        if (rates >= 100) {
          this.starWidths.push(100);
          rates -= 100;
        }
        else if (rates < 100 && rates > 0) {
          this.starWidths.push(rates)
          rates -= rates;
        }
        else if (rates <= 0) {
          this.starWidths.push(0);
        }
      }
    }
  }
}
