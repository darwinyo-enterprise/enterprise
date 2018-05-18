import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { Select, Store } from '@ngxs/store';

import { AppState } from '@enterprise/core';
import { Guid } from '@enterprise/shared';
import { Category, UploadFileModel } from '@enterprise/commerce/catalog-lib';
import { FileUploadState, SetModeFileUpload, AddFileImage, ClearFileUpload } from '@enterprise/material/file-upload';
import { take } from 'rxjs/operators';
import { CategoryState } from './../shared/category.state';

@Component({

  selector: 'eca-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})

/**TODO: Make Interaction with backend with progress bar */
export class CategoryFormComponent implements OnInit, OnChanges, OnDestroy {

  @Select(FileUploadState.getFileImages)
  fileImages: Observable<UploadFileModel[]>;

  @Select(CategoryState.getSelectedCategory)
  category$: Observable<Category>;
  //#endregion

  //#region Inputs Outputs

  /** Title of form */
  @Input() title: string;

  /** Name Save Button */
  @Input() nameSaveButton: string;

  /** Save Event triggered When save Button clicked */
  @Output() save: EventEmitter<Category>;

  //#endregion

  filesUpload$: Observable<UploadFileModel[]>;

  categoryForm: FormGroup;

  unsubscribe$: ReplaySubject<boolean>;

  constructor(private store: Store, private fb: FormBuilder) {
    this.createForm();

    this.save = new EventEmitter<Category>();

    // buffer size 1.
    this.unsubscribe$ = new ReplaySubject(1);

  }

  ngOnInit() {
    // If Input Supplied (Edit Mode)
    let category: Category;

    // take 2 for make sure get latest selected category
    this.category$.pipe(take(2)).subscribe(x => {
      category = x;
    },
      (err) => alert(err),
      () => {
        if (category != null) {
          this.store.dispatch([ClearFileUpload, new AddFileImage(
            {
              id: category.id.toString(),
              fileName: category.imageName.toString(),
              fileUrl: category.imageUrl
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
    return this.categoryForm.controls['name'];
  }

  /** Description Form Control Getter */
  get descriptionControl(): AbstractControl {
    return this.categoryForm.controls['description'];
  }

  /** Create Category Form By form builder */
  createForm() {
    this.categoryForm = this.fb.group({
      id: '',
      name: ['', Validators.required],
      description: '',
      imageUrl: '',
      imageName: ''
    });
  }

  /** resposible for change form value. */
  rebuildForm() {
    let targetCategory = <Category>{};
    this.category$.pipe(take(1)).subscribe((x) => {
      targetCategory = <Category>{
        id: x.id,
        name: x.name,
        description: x.description,
        imageName: x.imageName,
        imageUrl: x.imageUrl
      }
    }, (err) => {
      alert('error')
    }, () => {
      this.categoryForm.reset({
        id: targetCategory.id || '',
        name: targetCategory.name || '',
        description: targetCategory.description || '',
        imageUrl: targetCategory.imageUrl || '',
        imageName: targetCategory.imageName || ''
      });
    })

  }

  /** File Input Changed by Store Management */
  onFileInputChanged(uploadModel: UploadFileModel[]) {
    if (uploadModel.length > 0) {
      this.categoryForm.patchValue({
        imageUrl: uploadModel[0].fileUrl || '',
        imageName: uploadModel[0].fileName || ''
      });
    } else {
      this.categoryForm.patchValue({
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
    this.save.emit(this.categoryForm.value);
  }
}
