import { IPageChangeEvent } from "@covalent/core";

/** Change pagination command */
export class ChangePagination {
    static readonly type = "[LIST-ITEM-ACTIONS] CHANGE PAGINATION";

    /** Set Mode of file upload */
    constructor(public payload: IPageChangeEvent) { }
}
/** Change page size command */
export class ChangePageSize {
    static readonly type = "[LIST-ITEM-ACTIONS] CHANGE PAGE SIZE";

    /** Set Mode of file upload */
    constructor(public payload: number) { }
}

/** Reset pagination command */
export class ResetPagination {
    static readonly type = "[LIST-ITEM-ACTIONS] RESET PAGINATION";
}