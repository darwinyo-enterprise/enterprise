import { BasketItem } from "../../api/model/basketItem";
import { State, Selector, Action, StateContext, Select } from "@ngxs/store";
import { BasketService } from "./../../api/api/basket.service";
import { StorageService, RegisterLoadingOverlay, ErrorOccured, ResolveLoadingOverlay, Navigate, Alert, AppState, IConfiguration } from "@enterprise/core/src";
import { FetchBasket, BasketFetched, UpdateBasket, BasketUpdated, ItemBasketDeleted, DeleteItemBasket, AddItemBasket, CheckOutBasket, BasketCheckedOut, ItemBasketAdded, ClearBasket, ClearBasketOldPrice, AllItemBasketDeleted, DeleteAllItemBasket } from "./basket.action";
import { tap, take } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { CustomerBasket } from "../../api/model/customerBasket";
import { Observable } from "rxjs/Observable";

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
    @Select(AppState.configuration)
    configurations$: Observable<IConfiguration>;

    constructor(private basketService: BasketService, private storageService: StorageService) {
        this.setAccessToken();
    }
    //#region Selectors
    @Selector()
    static getBasketItems(state: BasketStateModel) {
        return state.basketItems;
    }

    @Selector()
    static getCustomerId(state: BasketStateModel) {
        return state.customerId;
    }

    //#endregion

    setAccessToken() {
        this.configurations$.pipe(take(1)).subscribe(x => {
            if (x !== null) {
                this.basketService.configuration.basePath = x.basketUrl;
            }
        });
        this.basketService.configuration.accessToken = this.storageService.retrieve('authorizationData');
    }

    //#region Commands and Event

    // DOne
    /** Command Fetch Basket API */
    @Action(FetchBasket, { cancelUncompleted: true })
    fetchBasket(
        { setState, dispatch }: StateContext<BasketStateModel>,
        { payload }: FetchBasket
    ) {
        // Register Loading Overlay
        dispatch(RegisterLoadingOverlay);

        // call basket service
        return this.basketService
            .apiV1BasketByIdGet(payload)
            .pipe(
                tap(
                    (basket) => {
                        if (basket !== null) {
                            setState({
                                basketItems: basket.items,
                                customerId: basket.buyerId
                            })
                        }
                        else {
                            setState({
                                basketItems: [],
                                customerId: this.storageService.retrieve('userData').profile.sub
                            })
                        }
                    },
                    (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
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
        { getState, dispatch }: StateContext<BasketStateModel>,
        { payload }: DeleteItemBasket
    ) {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());

        const state = getState();
        const index = state.basketItems.findIndex(x => x.productId === payload);

        state.basketItems.splice(index, 1);
        dispatch(ItemBasketDeleted);
    }

    // Done
    /** Basket Deleted Event */
    @Action(ItemBasketDeleted)
    basketItemDeleted(
        { dispatch, getState }: StateContext<BasketStateModel>) {
        const state = getState();
        dispatch([UpdateBasket,
            ResolveLoadingOverlay, new Alert("Item Deleted")])
    }

    //Done
    /** Delete Basket Item Command */
    @Action(DeleteAllItemBasket)
    deleteAllBasketItem(
        { dispatch, patchState }: StateContext<BasketStateModel>
    ) {
        patchState({
            basketItems: []
        });
        dispatch(AllItemBasketDeleted);

    }

    // Done
    /** Basket Deleted Event */
    @Action(AllItemBasketDeleted)
    allBasketItemDeleted(
        { dispatch, getState }: StateContext<BasketStateModel>) {
        const state = getState();
        dispatch([
            UpdateBasket,
            ResolveLoadingOverlay, new Alert("All Basket Item Deleted")]);
    }

    // DONE
    /** Update Basket Command */
    @Action(UpdateBasket)
    updateBasket(
        { dispatch, getState, patchState }: StateContext<BasketStateModel>
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
                    (basket) => {
                        patchState({
                            basketItems: basket.items,
                            customerId: basket.buyerId
                        })
                    },
                    (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                    () => dispatch(BasketUpdated))
            );
    }

    // Done
    /** Basket Updated Event */
    @Action(BasketUpdated)
    basketUpdated({ dispatch }: StateContext<BasketStateModel>) {
        dispatch([ResolveLoadingOverlay])
    }

    // Done
    /** Basket check out Event */
    @Action(BasketCheckedOut)
    basketCheckedOut({ dispatch }: StateContext<BasketStateModel>) {
        dispatch([ResolveLoadingOverlay, new Alert("Order Created")])
    }

    /** Check out Basket */
    @Action(CheckOutBasket)
    checkOutBasket(
        { dispatch, patchState }: StateContext<BasketStateModel>,
        { payload }: CheckOutBasket) {
        return this.basketService.apiV1BasketCheckoutPost(payload)
            .pipe(
                tap(
                    () => {
                        patchState({
                            basketItems: [],
                            customerId: ''
                        })
                    },
                    (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                    () => dispatch(BasketCheckedOut)
                )
            );
    }

    // Done
    /** Item Basket Added Event */
    @Action(ItemBasketAdded)
    itemBasketAdded({ dispatch }: StateContext<BasketStateModel>) {
        dispatch([UpdateBasket, new Alert("Item Added")])
    }

    /** Check out Basket */
    @Action(AddItemBasket)
    addItemBasket(
        { dispatch, patchState, getState }: StateContext<BasketStateModel>,
        { payload }: AddItemBasket) {
        const state = getState();
        if (state.basketItems.filter(x => x.productId === payload.productId).length > 0) {
            state.basketItems = state.basketItems.filter(x => x.productId === payload.productId).map(x => { x.quantity += payload.quantity; return x; });
            patchState({
                basketItems: [...state.basketItems]
            })
        } else {
            patchState({
                basketItems: [...state.basketItems, payload]
            });
        }

        dispatch(ItemBasketAdded);
    }

    //#endregion


    // Done
    /** Clear basket for testing */
    @Action(ClearBasket)
    clearBasket(
        { setState }: StateContext<BasketStateModel>) {
        setState({
            customerId: '',
            basketItems: []
        })
    }
    // Done
    /** Clear Old Price basket for testing */
    @Action(ClearBasketOldPrice)
    clearBasketOldPrice(
        { getState, patchState }: StateContext<BasketStateModel>) {
        const state = getState();
        const items = state.basketItems.map((v, i) => {
            v.oldUnitPrice = null;
            return v;
        });
        patchState({
            basketItems: items
        });
    }
}
