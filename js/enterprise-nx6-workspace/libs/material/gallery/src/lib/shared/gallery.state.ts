import { State, StateContext, Selector, Action } from "@ngxs/store";
import { ImageModel } from "../models/image.model";
import { SetImages, SelectImage } from "../shared/gallery.actions";

export interface GalleryStateModel {
    /** File for show */
    images: ImageModel[];
    /** Selected Image */
    selectedImage: ImageModel;
}

const defaults: GalleryStateModel = {
    images: [],
    selectedImage: null
};

@State({
    name: "gallery",
    defaults: defaults
})
export class GalleryState {
    constructor() { }

    //#region Selectors
    @Selector()
    static getImages(state: GalleryStateModel) {
        return state.images;
    }

    @Selector()
    static getSelectedImage(state: GalleryStateModel) {
        return state.selectedImage;
    }
    //#endregion

    //#region Commands and Event
    /** Set Images to display Command */
    @Action(SetImages)
    setImage(
        { setState }: StateContext<GalleryStateModel>,
        { payload }: SetImages
    ) {
        setState({
            images: payload,
            selectedImage: payload[0]
        });
    }

    /** Select Image Command */
    @Action(SelectImage)
    selectImage(
        { getState, patchState }: StateContext<GalleryStateModel>,
        { payload }: SelectImage) {
        const state = getState();
        patchState({
            selectedImage: state.images.filter(x => x.id === payload)[0]
        })
    }

    //#endregion
}
