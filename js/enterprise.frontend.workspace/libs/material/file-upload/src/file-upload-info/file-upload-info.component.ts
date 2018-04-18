import { Component, OnInit, Input } from '@angular/core';
import { FileUploadModel } from '../models/file-upload.model';

@Component({
  selector: 'em-file-upload-info',
  templateUrl: './file-upload-info.component.html',
  styleUrls: ['./file-upload-info.component.scss']
})
export class FileUploadInfoComponent implements OnInit {
  @Input() filesUpload: FileUploadModel[];
  constructor() { }

  ngOnInit() {
  }

  onDelete(id: string) {
    console.log(id);
  }
}
