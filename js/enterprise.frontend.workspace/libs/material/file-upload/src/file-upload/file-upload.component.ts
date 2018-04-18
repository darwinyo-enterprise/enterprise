import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploadModel } from '../models/file-upload.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  private filesData:FormData;
  @Input() filesUpload$: Observable<FileUploadModel[]>;

  /** Upload File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() uploadFile: EventEmitter<FormData>;

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<string>;
  constructor() {
    this.uploadFile = new EventEmitter<FormData>();
    this.deleteFile = new EventEmitter<string>();
  }

  ngOnInit() {}
  /** Triggered when you drop file to dropzone */
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
  }
  onFileUpload() {
    this.uploadFile.emit(this.filesData);
  }
  onFileDelete(id: string) {
    this.deleteFile.emit(id);
  }
}
