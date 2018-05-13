import { Manufacturer, ManufacturerService } from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

export const ManufacturersMock: Manufacturer[] = [
  <Manufacturer>{
    id: 1,
    name: 'Intel',
    description: 'CPU Manufacturer',
    imageName: 'Intel.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 2,
    name: 'Microsoft',
    description: 'Software Company',
    imageName: 'Microsoft.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 3,
    name: 'Google',
    description: 'Software Company',
    imageName: 'Google.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 4,
    name: 'Apple',
    description: 'Hardware Manufacturer',
    imageName: 'Apple.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 5,
    name: 'AMD',
    description: 'CPU Manufacturer',
    imageName: 'AMD.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 6,
    name: 'Docker',
    description: 'Software Company',
    imageName: 'Docker.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 7,
    name: 'Facebook',
    description: 'Software Company',
    imageName: 'Facebook.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 8,
    name: 'Samsung',
    description: 'Hardware Manufacturer',
    imageName: 'Samsung.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 9,
    name: 'Asus',
    description: 'Device Manufacturer',
    imageName: 'Asus.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 10,
    name: 'Dell',
    description: 'PC Manufacturer',
    imageName: 'Dell.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 11,
    name: 'Enterprise',
    description: 'Software Company',
    imageName: 'Enterprise.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 12,
    name: 'Adobe',
    description: 'Software Manufacturer',
    imageName: 'Adobe.png',
    imageUrl: 'http://mock-image/'
  }
];

export class ManufacturerServiceMock extends ManufacturerService {

  public apiV1ManufacturerByIdDelete(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public apiV1ManufacturerByIdDelete(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public apiV1ManufacturerByIdDelete(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public apiV1ManufacturerByIdDelete(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    return null;
  }


  public apiV1ManufacturerByIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<Manufacturer>;
  public apiV1ManufacturerByIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Manufacturer>>;
  public apiV1ManufacturerByIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Manufacturer>>;
  public apiV1ManufacturerByIdGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    return of(ManufacturersMock.filter(x => x.id === id)[0]);
  }


  public apiV1ManufacturerByIdPut(id: number, updateModel?: Manufacturer, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public apiV1ManufacturerByIdPut(id: number, updateModel?: Manufacturer, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public apiV1ManufacturerByIdPut(id: number, updateModel?: Manufacturer, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public apiV1ManufacturerByIdPut(id: number, updateModel?: Manufacturer, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    return null;
  }

  public apiV1ManufacturerGet(observe?: 'body', reportProgress?: boolean): Observable<Array<Manufacturer>>;
  public apiV1ManufacturerGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Manufacturer>>>;
  public apiV1ManufacturerGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Manufacturer>>>;
  public apiV1ManufacturerGet(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    return of(ManufacturersMock);
  }

  public apiV1ManufacturerImageByIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public apiV1ManufacturerImageByIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public apiV1ManufacturerImageByIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public apiV1ManufacturerImageByIdGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    return null;
  }

  public apiV1ManufacturerPost(manufacturer?: Manufacturer, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public apiV1ManufacturerPost(manufacturer?: Manufacturer, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public apiV1ManufacturerPost(manufacturer?: Manufacturer, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public apiV1ManufacturerPost(manufacturer?: Manufacturer, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    return null;
  }
}