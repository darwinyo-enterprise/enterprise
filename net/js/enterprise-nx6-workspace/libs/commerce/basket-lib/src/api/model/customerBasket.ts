/**
 * Basket HTTP API
 * The Basket Service HTTP API
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { BasketItem } from './basketItem';


export interface CustomerBasket {
    buyerId?: string;
    items?: Array<BasketItem>;
}
