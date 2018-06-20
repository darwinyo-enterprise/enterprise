/**
 * Ordering HTTP API
 * The Ordering Service HTTP API
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Orderitem } from './orderitem';


export interface Order {
    ordernumber?: number;
    date?: Date;
    status?: string;
    description?: string;
    street?: string;
    city?: string;
    zipcode?: string;
    country?: string;
    orderitems?: Array<Orderitem>;
    total?: number;
}