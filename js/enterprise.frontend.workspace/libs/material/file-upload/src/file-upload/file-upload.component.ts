import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FileUploadModel } from '../models/file-upload.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { AppState, RegisterLinearLoadingOverlay, ProgressLinearLoadingOverlay } from '@enterprise/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
/** TODO : REFACTOR CODE NEEDED */
export class FileUploadComponent implements OnInit, OnDestroy {
  /** when this triggered.
   *  all subscription must be unsubscribed.
   */
  unsubsribe$: ReplaySubject<boolean>;

  /** file data to upload */
  filesData: FormData;

  /** identifier for linear loading overlay as upload progress */
  progress: number;

  /** identify if current state is loading then shouldn't register another loading overlay.
   *  doesn't make sense to have multiple overlay at once.
   */
  @Select(AppState.isLoading)
  isLoading$: Observable<boolean>;

  /** this used for generate image card for user take actions */
  @Input() filesUpload: FileUploadModel[];

  /** Upload File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() uploadFile: EventEmitter<FormData>;

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<string>;

  /** TODO: HTTP CALL SHOULDN'T BE HERE.
   *  Refactor code needed.
   */
  constructor(private http: HttpClient, private store: Store) {
    this.uploadFile = new EventEmitter<FormData>();
    this.deleteFile = new EventEmitter<string>();

    // buffer size 1.
    this.unsubsribe$ = new ReplaySubject(1);
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.unsubsribe$.next(false);
    this.unsubsribe$.complete();
  }
  /** Triggered when you drop file to dropzone 
   *  TODO : REFACTOR CODE NEEDED.
  */
  onDropFileChanged(files) {
    console.log(files);

    if (files.length === 0) return;

    this.filesData = new FormData();

    for (let file of files) {
      var fileReader = new FileReader();
      fileReader.onloadend = (event: any) => {
        let base64: string = event.target.result;

        console.log(base64);

        this.filesData.append(file.name, file);

        console.log(this.filesData);
      };
      fileReader.readAsDataURL(file);
    }

    const uploadReq = new HttpRequest('POST', `api/upload`, this.filesData, {
      reportProgress: true,
    });

    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {

        this.isLoading$.pipe(
          takeUntil(this.unsubsribe$)
        ).subscribe(x => {
          if (!x) {
            this.store.dispatch([new RegisterLinearLoadingOverlay()])
          }
        })
        this.progress = Math.round(100 * event.loaded / event.total);
        this.store.dispatch([new ProgressLinearLoadingOverlay(this.progress)]);
      }
      else if (event.type === HttpEventType.Response)
        console.log(event.body.toString());
    });

  }
  onFileUpload() {
    this.uploadFile.emit(this.filesData);
  }
  onFileDelete(id: string) {
    this.deleteFile.emit(id);
  }
}
