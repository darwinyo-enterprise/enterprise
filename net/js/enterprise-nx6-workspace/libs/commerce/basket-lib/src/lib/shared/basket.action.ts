import { CustomerBasket } from "../../api/model/customerBasket";
import { BasketCheckout } from "../../api/model/basketCheckout";
import { BasketItem } from "../../api/model/basketItem";

/** Fetch Basket Command */
export class FetchBasket {
    static readonly type = '[COMMERCE] FETCH BASKET';
    /** customer id */
    constructor(public payload: string) { }
}


/** Basket Fetched Event */
export class BasketFetched {
    static readonly type = '[COMMERCE] BASKET FETCHED';
    constructor() { }
}

/** Delete Item Basket Command */
export class DeleteItemBasket {
    static readonly type = '[COMMERCE] DELETE ITEM BASKET';
    /** item id */
    constructor(public payload: string) { }
}

/** Item Basket Deleted Event */
export class ItemBasketDeleted {
    static readonly type = '[COMMERCE] ITEM BASKET DELETED';
    constructor() { }
}

/** Delete Item Basket Command */
export class DeleteAllItemBasket {
    static readonly type = '[COMMERCE] DELETE ALL ITEM BASKET';

    constructor() { }
}

/** Item Basket Deleted Event */
export class AllItemBasketDeleted {
    static readonly type = '[COMMERCE] ALL ITEM BASKET DELETED';
    constructor() { }
}

/** Check out basket Command */
export class CheckOutBasket {
    static readonly type = '[COMMERCE] CHECK OUT BASKET';
    constructor(public payload: BasketCheckout) { }
}

/** Basket Checked out Event */
export class BasketCheckedOut {
    static readonly type = '[COMMERCE] BASKET CHECKED OUT';
    constructor() { }
}

/** update basket Command */
export class UpdateBasket {
    static readonly type = '[COMMERCE] UPDATE BASKET';
    constructor() { }
}

/** Basket Checked out Event */
export class BasketUpdated {
    static readonly type = '[COMMERCE] BASKET UPDATED';
    constructor() { }
}


/** update basket Command */
export class AddItemBasket {
    static readonly type = '[COMMERCE] ADD ITEM BASKET';
    constructor(public payload: BasketItem) { }
}

/** Basket Added Event */
export class ItemBasketAdded {
    static readonly type = '[COMMERCE] ITEM BASKET ADDED';
    constructor() { }
}

/** Clear Basket for testing */
export class ClearBasket {
    static readonly type = '[COMMERCE] CLEAR ITEM BASKET';
    constructor() { }
}
/** Clear Old price Basket for testing */
export class ClearBasketOldPrice {
    static readonly type = '[COMMERCE] CLEAR OLD PRICE ITEM BASKET';
    constructor() { }
}
