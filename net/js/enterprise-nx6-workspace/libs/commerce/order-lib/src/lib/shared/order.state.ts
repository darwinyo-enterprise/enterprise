import { State, Selector, Action, StateContext } from "@ngxs/store";
import { OrdersService } from "../../api/api/orders.service";
import { StorageService, ErrorOccured, RegisterLoadingOverlay, ResolveLoadingOverlay } from "@enterprise/core/src";
import { UpdateOrderStatus, OrderStatusUpdated, CancelOrder, OrderCancelled, ShipOrder, OrderShipped, FetchSingleOrder, SingleOrderFetched } from "./order.action";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap, take, mergeMap, merge, takeLast } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Order } from "../../api/model/order";
import * as cl from "@enterprise/commerce/catalog-lib/src";
import { IntegrationEventLogEntry } from "../../api/model/integrationEventLogEntry";
import { IntegrationEventService } from "../../api/api/integrationEvent.service";


export interface OrderStateModel {
    orderId: number;
    orderStatus: string;
    selectedOrder: Order;
    orderTracks: IntegrationEventLogEntry[];
}

const defaults: OrderStateModel = {
    orderId: 0,
    orderStatus: '',
    selectedOrder: null,
    orderTracks: []
};

@State({
    name: 'order',
    defaults: defaults
})
export class OrderState {
    constructor(private orderService: OrdersService, private catalogIntegrationService: cl.IntegrationEventService, private orderIntegrationService: IntegrationEventService, private storageService: StorageService, public snackBar: MatSnackBar) {
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

    @Selector()
    static getOrderTracks(state: OrderStateModel) {
        return state.orderTracks;
    }

    //#endregion

    setAccessToken() {
        this.orderService.configuration.accessToken = this.storageService.retrieve('authorizationData');
        this.orderIntegrationService.configuration.accessToken = this.storageService.retrieve('authorizationData');
        this.catalogIntegrationService.configuration.accessToken = this.storageService.retrieve('authorizationData');
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
        { getState, patchState, dispatch }: StateContext<OrderStateModel>,
        { payload, status }: UpdateOrderStatus
    ) {
        const state = getState();
        let tracks: IntegrationEventLogEntry[] = [];

        const orderInteg = this.orderIntegrationService.byIdGet(payload);
        const catalogInteg = this.catalogIntegrationService.byIdGet(payload);

        const mergeInteg = orderInteg.pipe(merge(
            orderInteg.pipe(take(1)),
            catalogInteg.pipe(take(1))
        ));
        mergeInteg.pipe(takeLast(1)).subscribe(x => {
            if (x.length > 0) {
                tracks = tracks.concat(x);
                tracks = tracks.sort((a, b) => {
                    if (a.creationTime > b.creationTime) return 1;
                    if (a.creationTime < b.creationTime) return -1;
                    return 0;
                })
            }
        },
            err => console.log(err),
            () => {
                patchState({
                    orderId: payload,
                    orderStatus: status,
                    orderTracks: tracks
                })
                dispatch(OrderStatusUpdated);
            })
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
