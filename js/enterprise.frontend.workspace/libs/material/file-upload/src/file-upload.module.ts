import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FileDragNDropDirective } from "./file-drag-n-drop.directive";
import { FileUploadInfoComponent } from "./file-upload-info/file-upload-info.component";
import { SharedModule } from "@enterprise/shared";
import { NgxsModule } from "@ngxs/store";
import { FileUploadState } from "@enterprise/material/file-upload/src/shared/file-upload.state";

@NgModule({
  imports: [CommonModule, SharedModule, NgxsModule.forFeature([FileUploadState])],
  declarations: [
    FileUploadComponent,
    FileDragNDropDirective,
    FileUploadInfoComponent
  ],
  exports: [FileUploadComponent]
})
export class FileUploadModule {
}
