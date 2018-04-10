import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';
@NgModule({
  imports: [CommonModule],
  declarations: [FileUploadComponent, FileDragNDropDirective],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
