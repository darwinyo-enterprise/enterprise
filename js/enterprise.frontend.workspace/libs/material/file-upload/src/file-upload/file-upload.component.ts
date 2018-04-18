import { Component, OnInit } from '@angular/core';
import { FileUploadModel } from '../models/file-upload.model';

@Component({
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  filesUpload: FileUploadModel[];
  constructor() {}

  ngOnInit() {}
}
