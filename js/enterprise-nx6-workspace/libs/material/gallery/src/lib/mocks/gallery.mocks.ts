import { ImageModel } from "../models/image.model";

const faceImgBase64 = 'https://ecs7.tokopedia.net/img/cache/300/catalog/2017/7/18/20723476/20723476_adf87c53-1bcb-4fce-b5a5-7ce68fb23c7a.jpg';
export const GalleryMocks: ImageModel[] = [
    {
        id: "1",
        fileName: "1",
        fileUrl: faceImgBase64 + '1'
    } as ImageModel, {
        id: "2",
        fileName: "2",
        fileUrl: faceImgBase64 + '2'
    } as ImageModel, {
        id: "3",
        fileName: "3",
        fileUrl: faceImgBase64 + '3'
    } as ImageModel, {
        id: "4",
        fileName: "4",
        fileUrl: faceImgBase64 + '4'
    } as ImageModel
];
