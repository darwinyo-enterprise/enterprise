import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  Manufacturer,
  UploadFileModel
} from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Select, Store } from '@ngxs/store';
import { AppState } from '@enterprise/core';
import { FileUploadState } from '@enterprise/material/file-upload';
import { DeleteImageManufacturer, UploadImageManufacturer } from '../shared/manufacturer.actions';

@Component({
  selector: 'eca-manufacturer-form',
  templateUrl: './manufacturer-form.component.html',
  styleUrls: ['./manufacturer-form.component.scss']
})
export class ManufacturerFormComponent implements OnInit {
  /** identifier for linear loading overlay as upload progress */
  progress: number;

  /** identify if current state is loading then shouldn't register another loading overlay.
   *  doesn't make sense to have multiple overlay at once.
   */
  @Select(AppState.isLoading) isLoading$: Observable<boolean>;

  /** constant for manufacturer */
  @Select(FileUploadState.isMultiple) multiple: boolean;

  /** Title of form */
  @Input() title: string;

  /** Manufacturer if supplied then its in edit mode */
  @Input() manufacturer: Manufacturer;

  filesUpload$: Observable<UploadFileModel[]>;

  constructor(private store: Store) {

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

  ngOnInit() {}

  onUploadFile(uploadModels: UploadFileModel) {
    this.store.dispatch(new UploadImageManufacturer(uploadModels));
  }

  onDeleteFile(modelToDelete: UploadFileModel) {
    this.store.dispatch(new DeleteImageManufacturer(modelToDelete));
  }
}
