import { State, StateContext, Selector, Action } from "@ngxs/store";

import {
  FileImageAdded,
  FileImageDeleted,
  AddFileImage,
  DeleteFileImage,
  ClearFileUpload,
  FileUploadCleared,
  ValidateFileUpload,
  SetModeFileUpload
} from "./file-upload.actions";
import { UploadFileModel } from "@enterprise/material/file-upload";

export interface FileUploadStateModel {
  /** File for show */
  filesImages: UploadFileModel[];
  /** Accept Multiple file or not */
  multiple: boolean;

  /** Is Control disabled */
  disable: boolean;
}

const defaults: FileUploadStateModel = {
  filesImages: [],
  multiple: false,
  disable: false
};

@State({
  name: "fileupload",
  defaults: defaults
})
export class FileUploadState {
  constructor() { }

  //#region Selectors
  @Selector()
  static getFileImages(state: FileUploadStateModel) {
    return state.filesImages;
  }

  @Selector()
  static isMultiple(state: FileUploadStateModel) {
    return state.multiple;
  }

  @Selector()
  static isDisabled(state: FileUploadStateModel) {
    return state.disable;
  }
  //#endregion

  //#region Commands and Event
  /** Add FileImage Command */
  @Action(AddFileImage)
  addFileImage(
    { getState, patchState, dispatch }: StateContext<FileUploadStateModel>,
    { payload }: AddFileImage
  ) {
    const state = getState();
    patchState({
      filesImages: [...state.filesImages.concat(payload)]
    });
    dispatch(new FileImageAdded());
  }

  /** FileImage Added Event */
  @Action(FileImageAdded)
  fileImageAdded({ dispatch }: StateContext<FileUploadStateModel>) {
    dispatch(new ValidateFileUpload());
  }

  /** FileImage Deleted Event */
  @Action(DeleteFileImage)
  deleteFileImage(
    { getState, patchState, dispatch }: StateContext<FileUploadStateModel>,
    { payload }: DeleteFileImage
  ) {
    const state = getState();
    patchState({
      filesImages: state.filesImages.filter(x => x.fileName !== payload)
    });
    dispatch(new FileImageDeleted());
  }

  /** FileImage Deleted Event */
  @Action(FileImageDeleted)
  fileImageDeleted({ dispatch }: StateContext<FileUploadStateModel>) {
    dispatch(new ValidateFileUpload());
  }

  /** FileUpload Clear Command */
  @Action(ClearFileUpload)
  clearFileUpload({
    getState,
    patchState,
    dispatch
  }: StateContext<FileUploadStateModel>) {
    const state = getState();
    patchState({
      filesImages: []
    });
    dispatch(new FileUploadCleared());
  }

  /** FileImage Cleared Event */
  @Action(FileUploadCleared)
  fileUploadCleared({ dispatch }: StateContext<FileUploadStateModel>) {
    dispatch(new ValidateFileUpload());
  }

  /** Set File Upload Mode Command */
  @Action(SetModeFileUpload)
  SetModeFileUpload(
    { patchState }: StateContext<FileUploadStateModel>,
    { payload }: SetModeFileUpload
  ) {
    patchState({
      multiple: payload
    });
  }

  /**
   *  this will check if single then file image card not null then disable drop area.
   */
  @Action(ValidateFileUpload)
  validateFileUpload({
    getState,
    patchState
  }: StateContext<FileUploadStateModel>) {
    const state = getState();
    if (!state.multiple) {
      if (state.filesImages.length > 0) {
        patchState({
          disable: true
        });
      } else {
        patchState({
          disable: false
        });
      }
    } else {
      patchState({
        disable: false
      });
    }
  }

  //#endregion
}
