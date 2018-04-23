import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UploadFileModel } from '@enterprise/commerce/catalog-lib';

@Component({
  selector: 'em-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
/** TODO : REFACTOR CODE NEEDED */
/** Can Receive All Types of File. */
export class FileUploadComponent implements OnInit {
  
  /** Model For Upload */
  uploadFileModel: UploadFileModel[];

  /** Accept File Format
   *  Example : .doc, .exe, .xlsx, so on...
   *  image/*, video/*, so on...
   */
  @Input() accept: string;

  /** Identify is this control able to receive multiple files. */
  @Input() multiple: boolean = true;

  /** parent id will be used for naming directory name */
  @Input() parentId: string;

  /** this used for generate image card for user take actions */
  @Input() filesImage: UploadFileModel[];

  /** Upload File Event
   *  When this triggered you must define your own service logic.
   *
   * type:
   * If Multiple Can be return UploadFileModel[]
   * if single return UploadFileModel
   */
  @Output() uploadFile: EventEmitter<UploadFileModel[] | UploadFileModel>;

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output() deleteFile: EventEmitter<string>;

  constructor() {
    this.uploadFile = new EventEmitter<UploadFileModel[]>();
    this.deleteFile = new EventEmitter<string>();
    this.uploadFileModel = [];
  }

  ngOnInit() {}

  /** Triggered when you drop file to dropzone
   *  file reader async function will automaticly fill uploadFileModel
   */
  onDropFileChanged(files) {
    if (files.length === 0) return;
    for (let file of files) {
      var fileReader = new FileReader();

      fileReader.onloadend = (event: any) => {
        let base64: string = event.target.result;

        this.uploadFileModel.push(<UploadFileModel>{
          id: this.parentId,
          fileName: file.name,
          fileBase64: base64
        });
      };

      fileReader.readAsDataURL(file);
    }
  }

  onFileUpload() {
    this.uploadFile.emit(this.uploadFileModel);
  }

  onFileDelete(name: string) {
    this.deleteFile.emit(name);
  }
}
