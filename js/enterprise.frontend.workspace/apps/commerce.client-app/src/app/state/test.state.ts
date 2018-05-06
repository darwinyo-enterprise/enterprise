import { State, Action } from "@ngxs/store";
import { Dispatch } from "./test.action";

export interface TestStateModel {
}

const defaults: TestStateModel = {
};

@State({
    name: 'test',
    defaults: defaults
})
export class TestState {
    constructor() { }
    @Action(Dispatch)
    dispatch() {
        alert('hello');
    }
}  