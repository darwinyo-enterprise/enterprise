import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy
} from '@angular/core';
import {
  Manufacturer,
  UploadFileModel
} from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Select, Store } from '@ngxs/store';
import { AppState } from '@enterprise/core';
import { FileUploadState } from '@enterprise/material/file-upload';
import {
  DeleteImageManufacturer,
  UploadImageManufacturer
} from '../shared/manufacturer.actions';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { takeUntil } from 'rxjs/operators/takeUntil';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'eca-manufacturer-form',
  templateUrl: './manufacturer-form.component.html',
  styleUrls: ['./manufacturer-form.component.scss']
})
export class ManufacturerFormComponent implements OnInit, OnChanges, OnDestroy {
  /** identifier for linear loading overlay as upload progress */
  progress: number;

  /** identify if current state is loading then shouldn't register another loading overlay.
   *  doesn't make sense to have multiple overlay at once.
   */
  @Select(AppState.isLoading) isLoading$: Observable<boolean>;

  /** constant for manufacturer */
  @Select(FileUploadState.isMultiple) multiple: boolean;

  @Select(FileUploadState.getFileImages)
  fileImages: Observable<UploadFileModel[]>;

  /** Title of form */
  @Input() title: string;

  /** Manufacturer if supplied then its in edit mode */
  @Input() manufacturer: Manufacturer;

  /** Name Save Button */
  @Input() nameSaveButton: string;

  /** Save Event triggered When save Button clicked */
  @Output() save: EventEmitter<Manufacturer>;

  filesUpload$: Observable<UploadFileModel[]>;
  manufacturerForm: FormGroup;

  unsubscribe$: ReplaySubject<boolean>;

  constructor(private store: Store, private fb: FormBuilder) {
    this.createForm();

    this.save = new EventEmitter<Manufacturer>();

    // buffer size 1.
    this.unsubscribe$ = new ReplaySubject(1);
    // If Input Supplied (Edit Mode)
    if (this.manufacturer != null) {
      this.filesUpload$ = of([
        <UploadFileModel>{
          id: this.manufacturer.id.toString(),
          fileName: this.manufacturer.name.toString(),
          fileUrl: this.manufacturer.imageUrl
        }
      ]);
    }
  }

  ngOnInit() {
    this.fileImages
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(x => this.onFileInputChanged(x));
  }

  ngOnChanges(): void {
    this.rebuildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
    this.unsubscribe$.complete();
  }
  /** Create Manufacturer Form By form builder */
  createForm() {
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      imageUrl: '',
      imageName: ''
    });
  }

  /** resposible for change form value. */
  rebuildForm() {
    this.manufacturerForm.reset({
      name: this.manufacturer.imageName || '',
      description: this.manufacturer.description || '',
      imageUrl: this.manufacturer.imageUrl || '',
      imageName: this.manufacturer.imageName || ''
    });
  }

  /** Upload File Method */
  onUploadFile(uploadModels: Observable<UploadFileModel>) {
    uploadModels.subscribe(x =>
      this.store.dispatch(new UploadImageManufacturer(x))
    );
  }

  /** Delete File Method */
  onDeleteFile(modelToDelete: UploadFileModel) {
    this.store.dispatch(new DeleteImageManufacturer(modelToDelete));
  }

  onFileInputChanged(uploadModel: UploadFileModel[]) {
    if (uploadModel.length > 0) {
      this.manufacturerForm.patchValue({
        imageUrl: uploadModel[0].fileUrl || '',
        imageName: uploadModel[0].fileName || ''
      });
    } else {
      this.manufacturerForm.patchValue({
        imageUrl: '',
        imageName: ''
      });
    }
  }
  /** Should be handled for each form */
  onSaveBtnClicked() {
    this.save.emit(this.manufacturerForm.value);
    console.log(this.manufacturerForm.value);
  }
}
