import { CatalogItemViewModel, PaginatedCatalogViewModelCatalogItemViewModel } from "@enterprise/commerce/catalog-lib";

export const CatalogItemViewModelMock: CatalogItemViewModel = {
    catalogId: '1',
    name: 'test-product',
    price: 1231,
    overallRating: 3.5,
    totalFavorites: 2131,
    totalRatingCount: 2223,
    totalReviews: 3021,
    manufacturerId: 1,
    categoryId: 1,
    id: 1,
    imageUrl: 'hello',
    imageName: 'hex.svg'
}

export const PaginatedCatalogItemViewModelMock: PaginatedCatalogViewModelCatalogItemViewModel = {
    pageIndex: 0, pageSize: 10, count: 24, data:
        [
            { catalogId: "4", name: "ASUS ROG STRIX GL702ZC", price: 1490.00, overallRating: 4.80, totalFavorites: 3030, totalReviews: 5290, totalRatingCount: 4, manufacturerId: 2, categoryId: 3, id: 4, imageUrl: "http://localhost:5101/api/v1/product/image/4", imageName: "AsusROG.jpg" },
            { catalogId: "5", name: "ASUS ROG STRIX GL702ZD", price: 1590.00, overallRating: 4.80, totalFavorites: 4001, totalReviews: 30213, totalRatingCount: 3, manufacturerId: 2, categoryId: 3, id: 5, imageUrl: "http://localhost:5101/api/v1/product/image/5", imageName: "AsusROG.jpg" },
            { catalogId: "6", name: "ASUS ROG STRIX GL702ZE", price: 1990.00, overallRating: 4.80, totalFavorites: 6010, totalReviews: 34115, totalRatingCount: 4, manufacturerId: 2, categoryId: 3, id: 6, imageUrl: "http://localhost:5101/api/v1/product/image/6", imageName: "AsusROG.jpg" },
            { catalogId: "15", name: "Docker EE Advanced", price: 3200.00, overallRating: 4.80, totalFavorites: 30000, totalReviews: 529000, totalRatingCount: 2, manufacturerId: 5, categoryId: 2, id: 15, imageUrl: "http://localhost:5101/api/v1/product/image/15", imageName: "docker.png" },
            { catalogId: "13", name: "Docker EE Basic", price: 1200.00, overallRating: 4.80, totalFavorites: 30000, totalReviews: 529000, totalRatingCount: 3, manufacturerId: 5, categoryId: 2, id: 13, imageUrl: "http://localhost:5101/api/v1/product/image/13", imageName: "docker.png" },
            { catalogId: "14", name: "Docker EE Standard", price: 1900.00, overallRating: 4.80, totalFavorites: 30000, totalReviews: 529000, totalRatingCount: 4, manufacturerId: 5, categoryId: 2, id: 14, imageUrl: "http://localhost:5101/api/v1/product/image/14", imageName: "docker.png" },
            { catalogId: "18", name: "Google Pixel 2", price: 1123.00, overallRating: 5.00, totalFavorites: 3210, totalReviews: 5031, totalRatingCount: 3, manufacturerId: 4, categoryId: 1, id: 18, imageUrl: "http://localhost:5101/api/v1/product/image/18", imageName: "GooglePixel2.jpg" },
            { catalogId: "17", name: "Google Pixel 2 XL", price: 1131.00, overallRating: 5.00, totalFavorites: 3031, totalReviews: 21314, totalRatingCount: 4, manufacturerId: 4, categoryId: 1, id: 17, imageUrl: "http://localhost:5101/api/v1/product/image/17", imageName: "GooglePixel2XL.jpg" },
            { catalogId: "9", name: "iPhone 7 64 GB", price: 700.00, overallRating: 4.90, totalFavorites: 30, totalReviews: 590, totalRatingCount: 3, manufacturerId: 3, categoryId: 1, id: 9, imageUrl: "http://localhost:5101/api/v1/product/image/9", imageName: "iPhone7.png" },
            { catalogId: "8", name: "iPhone 8 64 GB", price: 900.00, overallRating: 4.70, totalFavorites: 3400, totalReviews: 51340, totalRatingCount: 4, manufacturerId: 3, categoryId: 1, id: 8, imageUrl: "http://localhost:5101/api/v1/product/image/8", imageName: "iPhone8.png" }
        ]
}