import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';
import { FileUploadInfoComponent } from './file-upload-info/file-upload-info.component';
@NgModule({
  imports: [CommonModule],
  declarations: [FileUploadComponent, FileDragNDropDirective, FileUploadInfoComponent],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
