import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FileUploadComponent } from "./file-upload.component";
import { BaseTestPage } from "@enterprise/core";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import {
  SetModeFileUpload,
  ValidateFileUpload,
  AddFileImage,
  DeleteFileImage
  } from "../shared/file-upload.actions";
import { FileUploadMocks } from "../mocks/file-upload.mocks";
import { Store, NgxsModule } from "@ngxs/store";
import { FileUploadState, UploadFileModel } from "@enterprise/material/file-upload";

export class FileUploadPage extends BaseTestPage<FileUploadComponent> {
  constructor(public fixture: ComponentFixture<FileUploadComponent>) {
    super(fixture);
  }

  get fileInput() {
    return this.query<HTMLInputElement>("input[type=file]");
  }

  get dropdownZone() {
    return this.query<HTMLElement>(".file-upload__drop-zone");
  }
}

describe("FileUploadComponent",
  () => {
    let component: FileUploadComponent;
    let fixture: ComponentFixture<FileUploadComponent>;
    let fileUploadPage: FileUploadPage;
    let mockFileUpload: UploadFileModel[];
    let store: Store;
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule, NgxsModule.forRoot([FileUploadState])],
          declarations: [FileUploadComponent],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      })
    );

    beforeEach(() => {
      mockFileUpload = FileUploadMocks;
      fixture = TestBed.createComponent(FileUploadComponent);
      component = fixture.componentInstance;

      fileUploadPage = new FileUploadPage(fixture);
      store = TestBed.get(Store);
      fixture.detectChanges();
    });
    describe("Functionality Test",
      () => {
        it("should have accept multiple attribute when multiple is true",
          () => {
            // Set Multiple to true
            store.dispatch(new SetModeFileUpload(true));

            // validate is file upload control is valid
            store.dispatch(new ValidateFileUpload());
            fixture.detectChanges();

            expect(fileUploadPage.fileInput.hasAttribute("multiple")).toBeTruthy();
          });
        it("should not have multiple attribute when multiple is false",
          () => {
            // Set Multiple to false
            store.dispatch(new SetModeFileUpload(false));

            // validate is file upload control is valid
            store.dispatch(new ValidateFileUpload());
            fixture.detectChanges();

            expect(fileUploadPage.fileInput.hasAttribute("multiple")).toBeFalsy();
          });
        it("should disable if multiple image exists in single",
          () => {
            // Set Multiple to false
            store.dispatch(new SetModeFileUpload(false));

            // validate is file upload control is valid
            store.dispatch(new ValidateFileUpload());

            fixture.detectChanges();
            //valid template
            const input = fileUploadPage.dropdownZone.textContent;

            store.dispatch(new AddFileImage(mockFileUpload));
            store.dispatch(new ValidateFileUpload());
            fixture.detectChanges();

            expect(fileUploadPage.dropdownZone.textContent).not.toContain(input);
          });
        it("should enable if all images deleted in single mode",
          () => {
            // Set Multiple to false
            store.dispatch(new SetModeFileUpload(false));

            // validate is file upload control is valid
            store.dispatch(new ValidateFileUpload());

            fixture.detectChanges();
            //valid template
            const input = fileUploadPage.dropdownZone.textContent;

            store.dispatch(new AddFileImage(mockFileUpload));
            store.dispatch(new ValidateFileUpload());
            fixture.detectChanges();

            expect(fileUploadPage.dropdownZone.textContent).not.toContain(input);

            mockFileUpload.forEach(x =>
              store.dispatch(new DeleteFileImage(x.fileName))
            );
            store.dispatch(new ValidateFileUpload());
            fixture.detectChanges();
            expect(fileUploadPage.dropdownZone.textContent).toContain(input);
          });
      });
    describe("UI Test",
      () => {
      });
  });
