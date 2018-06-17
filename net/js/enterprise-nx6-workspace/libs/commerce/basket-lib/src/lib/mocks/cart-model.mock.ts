import { BasketItem } from "../../api/model/basketItem";
import { CustomerBasket } from "@enterprise/commerce/basket-lib/src";

export const CartModelMock: BasketItem[] = [{
    productName: 'Intel 7700K',
    unitPrice: 2130,
    quantity: 3,
    pictureUrl: 'pictureUrl',
    oldUnitPrice: 1230,
    id: '1',
    productId: '1'
}, {
    productName: 'Intel 7600K',
    unitPrice: 2130,
    quantity: 3,
    pictureUrl: 'pictureUrl',
    oldUnitPrice: 1230,
    id: '2',
    productId: '2'
}, {
    productName: 'Intel 7500K',
    unitPrice: 2130,
    quantity: 3,
    pictureUrl: 'pictureUrl',
    oldUnitPrice: 1230,
    id: '3',
    productId: '3'
}, {
    productName: 'Intel 7400K',
    unitPrice: 2130,
    quantity: 3,
    pictureUrl: 'pictureUrl',
    oldUnitPrice: 1230,
    id: '4',
    productId: '4'
}, {
    productName: 'Intel 7300K',
    unitPrice: 2130,
    quantity: 3,
    pictureUrl: 'pictureUrl',
    oldUnitPrice: 1230,
    id: '5',
    productId: '5'
}]

export const CustomerBasketMock: CustomerBasket = {
    buyerId: '1',
    items: CartModelMock
}