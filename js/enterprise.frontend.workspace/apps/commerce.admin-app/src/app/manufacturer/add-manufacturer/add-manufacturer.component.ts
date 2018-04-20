import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Manufacturer,
  ManufacturerService,
  UploadFileModel
} from '@enterprise/commerce/catalog-lib';
import { takeUntil } from 'rxjs/operators/takeUntil';
import {
  RegisterLinearLoadingOverlay,
  ProgressLinearLoadingOverlay,
  AppState
} from '@enterprise/core';
import { Observable } from 'rxjs/Observable';
import { Select, Store } from '@ngxs/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'eca-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.scss']
})
export class AddManufacturerComponent implements OnInit, OnDestroy {
  /** when this triggered.
   *  all subscription must be unsubscribed.
   */
  unsubsribe$: ReplaySubject<boolean>;
  title: string;
  manufacturer: Manufacturer;

  /** identifier for linear loading overlay as upload progress */
  progress: number;

  /** identify if current state is loading then shouldn't register another loading overlay.
   *  doesn't make sense to have multiple overlay at once.
   */
  @Select(AppState.isLoading) isLoading$: Observable<boolean>;

  constructor(
    private manufacturerService: ManufacturerService,
    private store: Store
  ) {
    this.title = 'Add New Manufacturer';
    this.manufacturer = <Manufacturer>{};
    // buffer size 1.
    this.unsubsribe$ = new ReplaySubject(1);
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubsribe$.next(false);
    this.unsubsribe$.complete();
  }

  onFileUpload(uploadFiles: UploadFileModel[]) {
    console.log(uploadFiles);
    this.manufacturerService
      .apiV1ManufacturerImagePost(uploadFiles[0])
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.isLoading$.pipe(takeUntil(this.unsubsribe$)).subscribe(x => {
            if (!x) {
              this.store.dispatch([new RegisterLinearLoadingOverlay()]);
            }
          });
          this.progress = Math.round(100 * event.loaded / event.total);
          this.store.dispatch([
            new ProgressLinearLoadingOverlay(this.progress)
          ]);
        } else if (event.type === HttpEventType.Response)
          console.log(event.body.toString());
      });
  }
  onFileDelete(id: string) {
    console.log('DO SOMETHING FOR Delete');
  }
}
