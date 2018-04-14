import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ManufacturersMock } from './../mocks/manufacturer-service.mock';
import { ManufacturerModel } from './../models/manufacturer.model';
@Injectable()
export class ManufacturerService {
  constructor(private http: HttpClient) {}

  /**
   * used for get all manufacturers from backend.
   * TODO:
   * true implementation, remove Mocks
   */
  getManufacturerList(): Observable<ManufacturerModel[]> {
    return of(ManufacturersMock);
  }
}
