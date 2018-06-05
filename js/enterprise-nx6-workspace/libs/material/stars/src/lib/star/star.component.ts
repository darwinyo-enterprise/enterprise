import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'em-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements OnInit {
  @Input()
  starWidth: number;

  constructor() { }

  ngOnInit() {
  }

}
