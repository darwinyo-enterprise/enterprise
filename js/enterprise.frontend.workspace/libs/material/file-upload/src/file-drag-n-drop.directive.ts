import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

@Directive({
  selector: '[emFileDragNDrop]'
})
export class FileDragNDropDirective {
  /** If true then able to emit FileList
   *  else will emit File
   */
  @Input() fileMultiple: boolean;

  /** Wont Receive any interaction with user */
  @Input() disabled: boolean;

  /** Files Hovered into dropzone event */
  @Output() uploadFiles: EventEmitter<FileList | File>;

  @HostBinding('style.background') private background;
  @HostListener('dragover', ['$event'])
  public onDragOver(evt) {
    if (!this.disabled) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#999';
    }
  }
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    if (!this.disabled) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#eee';
    }
  }
  @HostListener('drop', ['$event'])
  public onDrop(evt) {
    if (!this.disabled) {
      evt.preventDefault();
      evt.stopPropagation();
      let files: FileList = evt.dataTransfer.files;
      if (files.length > 0) {
        this.background = '#eee';
        if (this.fileMultiple) {
          this.uploadFiles.emit(files);
        } else {
          this.uploadFiles.emit(files[0]);
        }
      }
    }
  }
  constructor() {
    this.uploadFiles = new EventEmitter<FileList | File>();
    if (!this.disabled) {
      this.background = '#eee';
    } else {
      this.background = '#7b7b7b';
    }
  }
}
