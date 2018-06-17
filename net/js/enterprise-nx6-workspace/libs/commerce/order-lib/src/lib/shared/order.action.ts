import { CancelOrderCommand } from "../../api/model/cancelOrderCommand";
import { ShipOrderCommand } from "../../api/model/shipOrderCommand";

/** Update Order status Command */
export class UpdateOrderStatus {
    static readonly type = '[COMMERCE] UPDATE ORDER STATUS';
    /** customer id */
    constructor(public payload: number,public status:string) { }
}

/** Order status updated Event */
export class OrderStatusUpdated {
    static readonly type = '[COMMERCE] ORDER STATUS UPDATED';
    constructor() { }
}

/** Cancel Order Command */
export class CancelOrder {
    static readonly type = '[COMMERCE] CANCEL ORDER';
    /** customer id */
    constructor(public payload: CancelOrderCommand) { }
}

/** Order Cancelled Event */
export class OrderCancelled {
    static readonly type = '[COMMERCE] ORDER CANCELLED';
    constructor() { }
}

/** Ship Order Command */
export class ShipOrder {
    static readonly type = '[COMMERCE] SHIP ORDER';
    /** customer id */
    constructor(public payload: ShipOrderCommand) { }
}

/** Order Shipped Event */
export class OrderShipped {
    static readonly type = '[COMMERCE] ORDER SHIPPED';
    constructor() { }
}

/** Ship Order Command */
export class FetchSingleOrder {
    static readonly type = '[COMMERCE] FETCH SINGLE ORDER';
    /** customer id */
    constructor(public payload: number) { }
}

/** Order Shipped Event */
export class SingleOrderFetched {
    static readonly type = '[COMMERCE] SINGLE ORDER FETCHED';
    constructor() { }
}

/** Fetch Orders Command */
export class FetchOrders {
    static readonly type = '[COMMERCE] FETCH ORDERS';
    /** customer id */
    constructor(public payload: string) { }
}

/** Orders Fetched Event */
export class OrdersFetched {
    static readonly type = '[COMMERCE] ORDERS FETCHED';
    constructor() { }
}
