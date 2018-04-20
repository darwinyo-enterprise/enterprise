import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FileImageModel } from '../models/file-upload.model';

@Component({
  selector: 'em-file-upload-info',
  templateUrl: './file-upload-info.component.html',
  styleUrls: ['./file-upload-info.component.scss']
})
export class FileUploadInfoComponent implements OnInit {
  @Input() filesUpload: FileImageModel[];
  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<string>;
  constructor() {
    this.deleteFile = new EventEmitter<string>();
  }

  ngOnInit() {}

  onDelete(name: string) {
    this.deleteFile.emit(name);
  }
}
