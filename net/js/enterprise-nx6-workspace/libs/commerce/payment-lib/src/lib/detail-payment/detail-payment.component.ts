import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '@enterprise/core/src';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'eca-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.scss']
})
export class DetailPaymentComponent implements OnInit, OnDestroy {
  @Select(AppState.userData)
  userData$: Observable<any>;
  userData: any;
  unsubscribe$: ReplaySubject<boolean>;
  constructor() {
    this.unsubscribe$ = new ReplaySubject(1);
  }

  ngOnInit() {
    this.userData$.pipe(takeUntil(this.unsubscribe$)).subscribe(x => {
      this.userData = x
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
  }

}
