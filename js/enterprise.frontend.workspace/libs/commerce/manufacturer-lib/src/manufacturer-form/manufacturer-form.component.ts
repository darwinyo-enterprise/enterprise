import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { Select, Store } from '@ngxs/store';

import { AppState } from '@enterprise/core';
import { Guid } from '@enterprise/shared';
import { Manufacturer, UploadFileModel } from '@enterprise/commerce/catalog-lib';
import { FileUploadState, SetModeFileUpload, AddFileImage, ClearFileUpload } from '@enterprise/material/file-upload';
import { take } from 'rxjs/operators';
import { ManufacturerState } from './../shared/manufacturer.state';

@Component({

  selector: 'eca-manufacturer-form',
  templateUrl: './manufacturer-form.component.html',
  styleUrls: ['./manufacturer-form.component.scss']
})

/**TODO: Make Interaction with backend with progress bar */
export class ManufacturerFormComponent implements OnInit, OnChanges, OnDestroy {
  //#region Selectors
  /** identify if current state is loading then shouldn't register another loading overlay.
   *  doesn't make sense to have multiple overlay at once.
   */
  @Select(AppState.isLoading) isLoading$: Observable<boolean>;

  /** constant for manufacturer */
  @Select(FileUploadState.isMultiple) multiple: boolean;

  @Select(FileUploadState.getFileImages)
  fileImages: Observable<UploadFileModel[]>;

  @Select(ManufacturerState.getSelectedManufacturer)
  manufacturer$: Observable<Manufacturer>;
  //#endregion

  //#region Inputs Outputs

  /** Title of form */
  @Input() title: string;

  /** Name Save Button */
  @Input() nameSaveButton: string;

  /** Save Event triggered When save Button clicked */
  @Output() save: EventEmitter<Manufacturer>;

  //#endregion

  filesUpload$: Observable<UploadFileModel[]>;

  manufacturerForm: FormGroup;

  unsubscribe$: ReplaySubject<boolean>;

  constructor(private store: Store, private fb: FormBuilder) {
    this.createForm();

    this.save = new EventEmitter<Manufacturer>();

    // buffer size 1.
    this.unsubscribe$ = new ReplaySubject(1);

  }

  ngOnInit() {
    // If Input Supplied (Edit Mode)
    let manufacturer: Manufacturer;

    // take 2 for make sure get latest selected manufacturer
    this.manufacturer$.pipe(take(2)).subscribe(x => {
      manufacturer = x;
    },
      (err) => alert(err),
      () => {
        if (manufacturer != null) {
          this.store.dispatch([ClearFileUpload, new AddFileImage(
            {
              id: manufacturer.id.toString(),
              fileName: manufacturer.imageName.toString(),
              fileUrl: manufacturer.imageUrl
            }
          )]);
          this.rebuildForm();
        }
      })

    // Set Multiple to false
    this.store.dispatch(new SetModeFileUpload(false));

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

  /** Name Form Control Getter */
  get nameControl(): AbstractControl {
    return this.manufacturerForm.controls['name'];
  }

  /** Description Form Control Getter */
  get descriptionControl(): AbstractControl {
    return this.manufacturerForm.controls['description'];
  }

  /** Create Manufacturer Form By form builder */
  createForm() {
    this.manufacturerForm = this.fb.group({
      id: '',
      name: ['', Validators.required],
      description: '',
      imageUrl: '',
      imageName: ''
    });
  }

  /** resposible for change form value. */
  rebuildForm() {
    let targetManufacturer = <Manufacturer>{};
    this.manufacturer$.pipe(take(1)).subscribe((x) => {
      targetManufacturer = <Manufacturer>{
        id: x.id,
        name: x.name,
        description: x.description,
        imageName: x.imageName,
        imageUrl: x.imageUrl
      }
    }, (err) => {
      alert('error')
    }, () => {
      this.manufacturerForm.reset({
        id: targetManufacturer.id || '',
        name: targetManufacturer.name || '',
        description: targetManufacturer.description || '',
        imageUrl: targetManufacturer.imageUrl || '',
        imageName: targetManufacturer.imageName || ''
      });
    })

  }

  /** File Input Changed by Store Management */
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

  /** Should be handled for each form.
   * add should hit add new api.
   * edit should hit update api.
   */
  onSaveBtnClicked() {
    this.save.emit(this.manufacturerForm.value);
  }
}
