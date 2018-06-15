import { BasketItem } from "../../api/model/basketItem";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { BasketService } from "./../../api/api/basket.service";
import { StorageService, RegisterLoadingOverlay, ErrorOccured, ResolveLoadingOverlay, Navigate, Alert } from "@enterprise/core/src";
import { FetchBasket, BasketFetched, UpdateBasket, BasketUpdated, ItemBasketDeleted, DeleteItemBasket, AddItemBasket, CheckOutBasket, BasketCheckedOut, ItemBasketAdded } from "./basket.action";
import { tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerBasket } from "@enterprise/commerce/basket-lib/src";

export interface BasketStateModel {
    basketItems: BasketItem[];
    customerId: string;
}

const defaults: BasketStateModel = {
    basketItems: null,
    customerId: ''
};

@State({
    name: 'basket',
    defaults: defaults
})
export class BasketState {
    constructor(private basketService: BasketService, private storageService: StorageService) {
        this.setAccessToken();
    }
    //#region Selectors
    @Selector()
    static getBasketItems(state: BasketStateModel) {
        return state.basketItems;
    }

    //#endregion

    setAccessToken() {
        this.basketService.configuration.accessToken = this.storageService.retrieve('authorizationData');
    }

    //#region Commands and Event

    // DOne
    /** Command Fetch Basket API */
    @Action(FetchBasket, { cancelUncompleted: true })
    fetchBasket(
        { patchState, dispatch }: StateContext<BasketStateModel>,
        { payload }: FetchBasket
    ) {
        // Register Loading Overlay
        dispatch(RegisterLoadingOverlay);

        // call basket service
        return this.basketService
            .apiV1BasketByIdGet(payload)
            .pipe(
                tap(
                    (basket) => patchState({
                        basketItems: basket.items,
                        customerId: basket.buyerId
                    }),
                    (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay, new Navigate({ commands: ['/basket/list'] })]),
                    () => { dispatch(BasketFetched) }
                )
            );
    }

    // Done
    /** Basket Fetched Event */
    @Action(BasketFetched)
    basketFetched(
        { dispatch }: StateContext<BasketStateModel>
    ) {
        dispatch(ResolveLoadingOverlay);
    }

    //Done
    /** Delete Basket Item Command */
    @Action(DeleteItemBasket)
    deleteBasketItem(
        { dispatch }: StateContext<BasketStateModel>,
        { payload }: DeleteItemBasket
    ) {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());

        return this.basketService
            .apiV1BasketByIdDelete(payload)
            .pipe(
                tap(
                    () => { },
                    (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                    () => dispatch(ItemBasketDeleted)
                )
            );
    }

    // Done
    /** Basket Deleted Event */
    @Action(ItemBasketDeleted)
    basketItemDeleted(
        { dispatch, getState }: StateContext<BasketStateModel>) {
        const state = getState();
        dispatch([
            new FetchBasket(state.customerId),
            ResolveLoadingOverlay, new Alert("Basket Item Deleted")]);
    }

    // DONE
    /** Update Basket Command */
    @Action(UpdateBasket)
    updateBasket(
        { dispatch, getState }: StateContext<BasketStateModel>
    ) {
        const state = getState();
        const customerBasket: CustomerBasket = {
            items: state.basketItems,
            buyerId: state.customerId
        };

        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());

        return this.basketService
            .apiV1BasketPost(customerBasket)
            .pipe(
                tap(
                    () => { },
                    (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                    () => dispatch(BasketUpdated))
            );
    }

    // Done
    /** Basket Updated Event */
    @Action(BasketUpdated)
    basketUpdated({ dispatch }: StateContext<BasketStateModel>) {
        dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/basket/list'] }), new Alert("Basket Updated")])
    }

    // Done
    /** Basket check out Event */
    @Action(BasketCheckedOut)
    basketCheckedOut({ dispatch }: StateContext<BasketStateModel>) {
        dispatch([ResolveLoadingOverlay, new Navigate({ commands: ['/basket/list'] }), new Alert("Basket Updated")])
    }

    /** Check out Basket */
    @Action(CheckOutBasket)
    checkOutBasket(
        { dispatch, patchState }: StateContext<BasketStateModel>,
        { payload }: CheckOutBasket) {
        this.basketService.apiV1BasketCheckoutPost(payload).pipe(
            tap(
                () => { },
                (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                () => dispatch(BasketCheckedOut))
        )
        dispatch(BasketCheckedOut);
    }

    // Done
    /** Item Basket Added Event */
    @Action(ItemBasketAdded)
    itemBasketAdded({ dispatch }: StateContext<BasketStateModel>) {
        dispatch([UpdateBasket, ResolveLoadingOverlay, new Navigate({ commands: ['/basket/list'] }), new Alert("Basket Updated")])
    }

    /** Check out Basket */
    @Action(AddItemBasket)
    addItemBasket(
        { dispatch, patchState, getState }: StateContext<BasketStateModel>,
        { payload }: AddItemBasket) {
        const state = getState();
        patchState({
            basketItems: [...state.basketItems, payload]
        });
        dispatch(ItemBasketAdded);
    }

    //#endregion
}
