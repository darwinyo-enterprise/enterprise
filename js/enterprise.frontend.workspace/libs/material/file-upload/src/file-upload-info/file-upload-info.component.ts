import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output } from "@angular/core";
import { UploadFileModel } from "@enterprise/commerce/catalog-lib";

@Component({
  
  selector: "em-file-upload-info",
  templateUrl: "./file-upload-info.component.html",
  styleUrls: ["./file-upload-info.component.scss"]
})
export class FileUploadInfoComponent implements OnInit {
  /** Input Existing Images */
  @Input()
  filesUpload: UploadFileModel[];

  /** Delete File Event
   *  When this triggered you must define your own service logic.
   */
  @Output()
  deleteFile: EventEmitter<UploadFileModel>;

  constructor() {
    this.deleteFile = new EventEmitter<UploadFileModel>();
  }

  ngOnInit() {}

  onDelete(uploadFileModel: UploadFileModel) {
    this.deleteFile.emit(uploadFileModel);
  }
}
