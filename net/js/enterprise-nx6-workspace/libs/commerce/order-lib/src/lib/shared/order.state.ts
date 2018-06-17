import { State, Selector, Action, StateContext } from "@ngxs/store";
import { OrdersService } from "../../api/api/orders.service";
import { StorageService, ErrorOccured, RegisterLoadingOverlay, ResolveLoadingOverlay } from "@enterprise/core/src";
import { UpdateOrderStatus, OrderStatusUpdated, CancelOrder, OrderCancelled, ShipOrder, OrderShipped, FetchSingleOrder, SingleOrderFetched } from "./order.action";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Order } from "../../api/model/order";

export interface OrderStateModel {
    orderId: number;
    orderStatus: string;
    selectedOrder: Order;
}

const defaults: OrderStateModel = {
    orderId: 0,
    orderStatus: '',
    selectedOrder: null
};

@State({
    name: 'order',
    defaults: defaults
})
export class OrderState {
    constructor(private orderService: OrdersService, private storageService: StorageService, public snackBar: MatSnackBar) {
        this.setAccessToken();
    }
    //#region Selectors
    @Selector()
    static getOrderStatus(state: OrderStateModel) {
        return state.orderStatus;
    }

    @Selector()
    static getOrderId(state: OrderStateModel) {
        return state.orderId;
    }

    //#endregion

    setAccessToken() {
        this.orderService.configuration.accessToken = this.storageService.retrieve('authorizationData');
    }
    openSnackbar(message: string) {
        this.snackBar.open(message, '', {
            duration: 2000
        });
    }
    //#region Commands and Event

    // DOne
    /** Command Update Order Status */
    @Action(UpdateOrderStatus, { cancelUncompleted: true })
    updateOrderStatus(
        { patchState, dispatch }: StateContext<OrderStateModel>,
        { payload, status }: UpdateOrderStatus
    ) {
        patchState({
            orderId: payload,
            orderStatus: status
        })
        dispatch(OrderStatusUpdated);
    }

    // Done
    /** Order Status Updated Event */
    @Action(OrderStatusUpdated)
    orderStatusUpdated(
        { getState }: StateContext<OrderStateModel>
    ) {
        const state = getState();
        this.openSnackbar('Updated to status: ' + state.orderStatus + ' Order Id: ' + state.orderId);
    }
    // DOne
    /** Command Cancel Order */
    @Action(CancelOrder, { cancelUncompleted: true })
    cancelOrder(
        { dispatch }: StateContext<OrderStateModel>,
        { payload }: CancelOrder
    ) {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());

        this.orderService.apiV1OrdersCancelPut(payload).pipe(
            tap(
                () => { },
                (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                () => dispatch(OrderCancelled)
            )
        );
    }

    // Done
    /** Order Cancelled Updated Event */
    @Action(OrderCancelled)
    orderCancelled(
        { dispatch }: StateContext<OrderStateModel>
    ) {
        dispatch([ResolveLoadingOverlay])
    }

    // DOne
    /** Command Ship Order */
    @Action(ShipOrder, { cancelUncompleted: true })
    shipOrder(
        { dispatch }: StateContext<OrderStateModel>,
        { payload }: ShipOrder
    ) {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());

        this.orderService.apiV1OrdersShipPut(payload).pipe(
            tap(
                () => { },
                (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                () => dispatch(OrderShipped)
            )
        );
    }

    // Done
    /** Order Shipped Updated Event */
    @Action(OrderShipped)
    orderShipped(
        { dispatch }: StateContext<OrderStateModel>
    ) {
        dispatch([ResolveLoadingOverlay])
    }

    // DOne
    /** Command Fetch Single Order by id */
    @Action(FetchSingleOrder, { cancelUncompleted: true })
    fetchSingleOrder(
        { patchState, dispatch }: StateContext<OrderStateModel>,
        { payload }: FetchSingleOrder
    ) {
        // Register Loading Overlay
        dispatch(new RegisterLoadingOverlay());

        this.orderService.apiV1OrdersByOrderIdGet(payload).pipe(
            tap(
                (order) => {
                    patchState({
                        selectedOrder: order,
                        orderId: order.ordernumber,
                        orderStatus: order.status
                    })
                },
                (err: HttpErrorResponse) => dispatch([new ErrorOccured(err.error['message']), ResolveLoadingOverlay]),
                () => dispatch(SingleOrderFetched)
            )
        );
    }

    // Done
    /** Single Order fetched Event */
    @Action(SingleOrderFetched)
    singleOrderFetched(
        { dispatch }: StateContext<OrderStateModel>
    ) {
        dispatch([ResolveLoadingOverlay])
    }

    //#endregion
}
