import { State, StateContext, Selector, Action } from "@ngxs/store";
import { ChangePagination, ResetPagination, ChangePageSize } from "../shared/list-item-actions.actions";

export interface ListItemActionStateModel {
    page: number;
    maxPage: number;
    pageSize: number;
    total: number;
    fromRow: number;
    toRow: number;
}

const defaults: ListItemActionStateModel = {
    page: 10,
    maxPage: 0,
    pageSize: 0,
    total: 0,
    fromRow: 0,
    toRow: 0
};

@State({
    name: "listItemAction",
    defaults: defaults
})
export class ListItemActionState {
    constructor() { }

    //#region Selectors
    @Selector()
    static getPageInfo(state: ListItemActionStateModel) {
        return state;
    }
    @Selector()
    static getPage(state: ListItemActionStateModel) {
        return state.page;
    }

    @Selector()
    static getMaxpage(state: ListItemActionStateModel) {
        return state.maxPage;
    }

    @Selector()
    static getPageSize(state: ListItemActionStateModel) {
        return state.pageSize;
    }

    @Selector()
    static getTotal(state: ListItemActionStateModel) {
        return state.total;
    }
    //#endregion

    //#region Commands and Event
    /** Change pagination Command */
    @Action(ChangePagination)
    changePagination(
        { patchState }: StateContext<ListItemActionStateModel>,
        { payload }: ChangePagination
    ) {
        patchState({
            page: payload.page - 1,
            pageSize: payload.pageSize,
            maxPage: payload.maxPage,
            total: payload.total,
            toRow: 0,
            fromRow: 0
        });
    }

    /** Change page size Command */
    @Action(ChangePageSize)
    changePageSize(
        { patchState }: StateContext<ListItemActionStateModel>,
        { payload }: ChangePageSize
    ) {
        patchState({
            pageSize: payload,
        });
    }

    /** Reset pagination Command */
    @Action(ResetPagination)
    resetPagination(
        { patchState }: StateContext<ListItemActionStateModel>
    ) {
        patchState({
            page: 0, pageSize: 10, maxPage: 0, toRow: 0, total: 0, fromRow: 0
        });
    }

    //#endregion
}
