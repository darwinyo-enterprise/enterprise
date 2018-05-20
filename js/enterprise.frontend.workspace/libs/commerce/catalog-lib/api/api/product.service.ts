/**
 * Enterprise Commerce - Catalog HTTP API
 * The Catalog Microservice HTTP API. This is a Data-Driven/CRUD microservice sample
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs/Observable';

import { PaginatedCatalogViewModelCatalogItemViewModel } from '../model/paginatedCatalogViewModelCatalogItemViewModel';
import { PaginatedListViewModelItemViewModel } from '../model/paginatedListViewModelItemViewModel';
import { Product } from '../model/product';
import { ProductRateViewModel } from '../model/productRateViewModel';
import { ProductViewModel } from '../model/productViewModel';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ProductService {

    protected basePath = 'http://localhost:5101';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (let consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductByIdDelete(id: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiV1ProductByIdDelete(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiV1ProductByIdDelete(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiV1ProductByIdDelete(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling apiV1ProductByIdDelete.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.delete<any>(`${this.basePath}/api/v1/Product/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductByIdGet(id: string, observe?: 'body', reportProgress?: boolean): Observable<Product>;
    public apiV1ProductByIdGet(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Product>>;
    public apiV1ProductByIdGet(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Product>>;
    public apiV1ProductByIdGet(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling apiV1ProductByIdGet.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.get<Product>(`${this.basePath}/api/v1/Product/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param id 
     * @param updateModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductByIdPut(id: number, updateModel?: Product, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiV1ProductByIdPut(id: number, updateModel?: Product, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiV1ProductByIdPut(id: number, updateModel?: Product, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiV1ProductByIdPut(id: number, updateModel?: Product, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling apiV1ProductByIdPut.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json-patch+json',
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.put<any>(`${this.basePath}/api/v1/Product/${encodeURIComponent(String(id))}`,
            updateModel,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param pageSize 
     * @param pageIndex 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductGet(pageSize?: number, pageIndex?: number, observe?: 'body', reportProgress?: boolean): Observable<PaginatedCatalogViewModelCatalogItemViewModel>;
    public apiV1ProductGet(pageSize?: number, pageIndex?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PaginatedCatalogViewModelCatalogItemViewModel>>;
    public apiV1ProductGet(pageSize?: number, pageIndex?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PaginatedCatalogViewModelCatalogItemViewModel>>;
    public apiV1ProductGet(pageSize?: number, pageIndex?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (pageSize !== undefined) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
        }
        if (pageIndex !== undefined) {
            queryParameters = queryParameters.set('pageIndex', <any>pageIndex);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.get<PaginatedCatalogViewModelCatalogItemViewModel>(`${this.basePath}/api/v1/Product`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductImageByIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiV1ProductImageByIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiV1ProductImageByIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiV1ProductImageByIdGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling apiV1ProductImageByIdGet.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.get<any>(`${this.basePath}/api/v1/Product/image/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param id 
     * @param amount 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductInventoryPut(id?: string, amount?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiV1ProductInventoryPut(id?: string, amount?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiV1ProductInventoryPut(id?: string, amount?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiV1ProductInventoryPut(id?: string, amount?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined) {
            queryParameters = queryParameters.set('id', <any>id);
        }
        if (amount !== undefined) {
            queryParameters = queryParameters.set('amount', <any>amount);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.put<any>(`${this.basePath}/api/v1/Product/inventory`,
            null,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param pageSize 
     * @param pageIndex 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductListGet(pageSize?: number, pageIndex?: number, observe?: 'body', reportProgress?: boolean): Observable<PaginatedListViewModelItemViewModel>;
    public apiV1ProductListGet(pageSize?: number, pageIndex?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PaginatedListViewModelItemViewModel>>;
    public apiV1ProductListGet(pageSize?: number, pageIndex?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PaginatedListViewModelItemViewModel>>;
    public apiV1ProductListGet(pageSize?: number, pageIndex?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (pageSize !== undefined) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
        }
        if (pageIndex !== undefined) {
            queryParameters = queryParameters.set('pageIndex', <any>pageIndex);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.get<PaginatedListViewModelItemViewModel>(`${this.basePath}/api/v1/Product/list`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param product 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductPost(product?: ProductViewModel, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiV1ProductPost(product?: ProductViewModel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiV1ProductPost(product?: ProductViewModel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiV1ProductPost(product?: ProductViewModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json-patch+json',
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/api/v1/Product`,
            product,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param name 
     * @param pageSize 
     * @param pageIndex 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductQueryByNameGet(name: string, pageSize?: number, pageIndex?: number, observe?: 'body', reportProgress?: boolean): Observable<PaginatedCatalogViewModelCatalogItemViewModel>;
    public apiV1ProductQueryByNameGet(name: string, pageSize?: number, pageIndex?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PaginatedCatalogViewModelCatalogItemViewModel>>;
    public apiV1ProductQueryByNameGet(name: string, pageSize?: number, pageIndex?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PaginatedCatalogViewModelCatalogItemViewModel>>;
    public apiV1ProductQueryByNameGet(name: string, pageSize?: number, pageIndex?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling apiV1ProductQueryByNameGet.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (pageSize !== undefined) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
        }
        if (pageIndex !== undefined) {
            queryParameters = queryParameters.set('pageIndex', <any>pageIndex);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.get<PaginatedCatalogViewModelCatalogItemViewModel>(`${this.basePath}/api/v1/Product/query/${encodeURIComponent(String(name))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param idCategory 
     * @param idManufacturer 
     * @param pageSize 
     * @param pageIndex 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductQueryCategoryByIdCategoryManufacturerByIdManufacturerGet(idCategory: number, idManufacturer: number, pageSize?: number, pageIndex?: number, observe?: 'body', reportProgress?: boolean): Observable<PaginatedCatalogViewModelCatalogItemViewModel>;
    public apiV1ProductQueryCategoryByIdCategoryManufacturerByIdManufacturerGet(idCategory: number, idManufacturer: number, pageSize?: number, pageIndex?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PaginatedCatalogViewModelCatalogItemViewModel>>;
    public apiV1ProductQueryCategoryByIdCategoryManufacturerByIdManufacturerGet(idCategory: number, idManufacturer: number, pageSize?: number, pageIndex?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PaginatedCatalogViewModelCatalogItemViewModel>>;
    public apiV1ProductQueryCategoryByIdCategoryManufacturerByIdManufacturerGet(idCategory: number, idManufacturer: number, pageSize?: number, pageIndex?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (idCategory === null || idCategory === undefined) {
            throw new Error('Required parameter idCategory was null or undefined when calling apiV1ProductQueryCategoryByIdCategoryManufacturerByIdManufacturerGet.');
        }
        if (idManufacturer === null || idManufacturer === undefined) {
            throw new Error('Required parameter idManufacturer was null or undefined when calling apiV1ProductQueryCategoryByIdCategoryManufacturerByIdManufacturerGet.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (pageSize !== undefined) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
        }
        if (pageIndex !== undefined) {
            queryParameters = queryParameters.set('pageIndex', <any>pageIndex);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        return this.httpClient.get<PaginatedCatalogViewModelCatalogItemViewModel>(`${this.basePath}/api/v1/Product/query/category/${encodeURIComponent(String(idCategory))}/manufacturer/${encodeURIComponent(String(idManufacturer))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param productRateViewModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1ProductRatePost(productRateViewModel?: ProductRateViewModel, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiV1ProductRatePost(productRateViewModel?: ProductRateViewModel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiV1ProductRatePost(productRateViewModel?: ProductRateViewModel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiV1ProductRatePost(productRateViewModel?: ProductRateViewModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json-patch+json',
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/api/v1/Product/rate`,
            productRateViewModel,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
