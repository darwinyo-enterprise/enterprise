import { ComponentFixture } from "@angular/core/testing";

export class BaseTestPage<T>{

  constructor(public fixture: ComponentFixture<T>) {
  }
    //// query helpers ////
  protected query<TE>(selector: string): TE {
    return this.fixture.nativeElement.querySelector(selector);
  }

  protected queryAll<TE>(selector: string): TE[] {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }
}