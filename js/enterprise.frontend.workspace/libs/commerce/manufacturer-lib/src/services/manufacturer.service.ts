import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ManufacturersMock } from './../mocks/manufacturer-service.mock';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';
@Injectable()
export class ManufacturerService {
  constructor(private http: HttpClient) {}

  /**
   * used for get all manufacturers from backend.
   * TODO:
   * true implementation, remove Mocks
   */
  getManufacturerList(): Observable<Manufacturer[]> {
    return of(ManufacturersMock);
  }
}
