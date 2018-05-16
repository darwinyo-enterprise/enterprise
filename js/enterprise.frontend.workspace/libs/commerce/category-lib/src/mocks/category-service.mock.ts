import { Category, CategoryService } from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

export const CategoriesMock: Category[] = [
  <Category>{
    id: 1,
    name: 'CPU',
    description: 'CPU Category',
    imageName: 'Intel.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 2,
    name: 'Software',
    description: 'Software Company',
    imageName: 'Microsoft.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 3,
    name: 'PC',
    description: 'Software Company',
    imageName: 'Google.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 4,
    name: 'Laptop',
    description: 'Hardware Category',
    imageName: 'Apple.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 5,
    name: 'Tablet',
    description: 'CPU Category',
    imageName: 'AMD.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 6,
    name: 'TV',
    description: 'Software Company',
    imageName: 'Docker.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 7,
    name: 'Console',
    description: 'Software Company',
    imageName: 'Facebook.png',
    imageUrl: 'http://mock-image/'
  }
];

export class CategoryServiceMock {
  
  // public apiV1CategoryByIdDelete(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
  // public apiV1CategoryByIdDelete(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  // public apiV1CategoryByIdDelete(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  // public apiV1CategoryByIdDelete(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
  //   return of(CategoriesMock);
  // }


  // public apiV1CategoryByIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<Category>;
  // public apiV1CategoryByIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Category>>;
  // public apiV1CategoryByIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Category>>;
  // public apiV1CategoryByIdGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
  //   console.log('im called');
  //   return of(CategoriesMock.filter(x => x.id === id)[0]);
  // }


  // public apiV1CategoryByIdPut(id: number, updateModel?: Category, observe?: 'body', reportProgress?: boolean): Observable<any>;
  // public apiV1CategoryByIdPut(id: number, updateModel?: Category, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  // public apiV1CategoryByIdPut(id: number, updateModel?: Category, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  // public apiV1CategoryByIdPut(id: number, updateModel?: Category, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
  //   return of(CategoriesMock);
  // }

   apiV1CategoryGet(): Observable<Category[]> {

    return of(CategoriesMock);
  }

  // public apiV1CategoryImageByIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
  // public apiV1CategoryImageByIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  // public apiV1CategoryImageByIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  // public apiV1CategoryImageByIdGet(id: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
  //   return of(CategoriesMock);
  // }

  // public apiV1CategoryPost(manufacturer?: Category, observe?: 'body', reportProgress?: boolean): Observable<any>;
  // public apiV1CategoryPost(manufacturer?: Category, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  // public apiV1CategoryPost(manufacturer?: Category, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  // public apiV1CategoryPost(manufacturer?: Category, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
  //   return of(CategoriesMock);
  // }
}