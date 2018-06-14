import { ProductService, ProductViewModel, PaginatedListViewModelItemViewModel, ProductColor } from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

export const PaginatedProductMock: PaginatedListViewModelItemViewModel =
  {
    listData: [
      <ProductViewModel>{
        id: '1',
        name: 'Intel',
        price: 1000,
        actorId: '1',
        manufacturerId: 1,
        categoryId: 1,
        productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
        productImages: [
          {
            imageName: 'intel.png',
            imageUrl: 'http://mock-image/'
          }
        ],
        description: 'CPU Product',
        stock: 1,
        discount: 10,
        location: 'New York',
        minPurchase: 1,
        hasExpiry: 'true',
        expireDate: '2018-06-05T07:00:00.000Z'
      },
      <ProductViewModel>{
        id: '2',
        name: 'Intel2',
        price: 1000,
        actorId: '1',
        manufacturerId: 1,
        categoryId: 1,
        productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
        productImages: [
          {
            imageName: 'intel.png',
            imageUrl: 'http://mock-image/'
          }
        ],
        description: 'CPU Product',
        stock: 1,
        discount: 10,
        location: 'New York',
        minPurchase: 1,
        hasExpiry: 'true',
        expireDate: '2018-06-05T07:00:00.000Z'
      },
      <ProductViewModel>{
        id: '3',
        name: 'Intel3',
        price: 1000,
        actorId: '1',
        manufacturerId: 1,
        categoryId: 1,
        productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
        productImages: [
          {
            imageName: 'intel.png',
            imageUrl: 'http://mock-image/'
          }
        ],
        description: 'CPU Product',
        stock: 1,
        discount: 10,
        location: 'New York',
        minPurchase: 1,
        hasExpiry: 'true',
        expireDate: '2018-06-05T07:00:00.000Z'
      },
      <ProductViewModel>{
        id: '4',
        name: 'Intel4',
        price: 1000,
        actorId: '1',
        manufacturerId: 1,
        categoryId: 1,
        productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
        productImages: [
          {
            imageName: 'intel.png',
            imageUrl: 'http://mock-image/'
          }
        ],
        description: 'CPU Product',
        stock: 1,
        discount: 10,
        location: 'New York',
        minPurchase: 1,
        hasExpiry: 'true',
        expireDate: '2018-06-05T07:00:00.000Z'
      },
      <ProductViewModel>{
        id: '5',
        name: 'Intel5',
        price: 1000,
        actorId: '1',
        manufacturerId: 1,
        categoryId: 1,
        productColors: [<ProductColor>{
          name: 'Yellow'
        }, <ProductColor>{
          name: 'Red'
        }, <ProductColor>{
          name: 'Blue'
        }],
        productImages: [
          {
            imageName: 'intel.png',
            imageUrl: 'http://mock-image/'
          }
        ],
        description: 'CPU Product',
        stock: 1,
        discount: 10,
        location: 'New York',
        minPurchase: 1,
        hasExpiry: 'true',
        expireDate: '2018-06-05T07:00:00.000Z'
      },
    ],
    pageIndex: 1,
    pageSize: 10,
    count: 5
  }

export const ProductViewModelsMock: ProductViewModel[] = [
  <ProductViewModel>{
    id: '1',
    name: 'Intel',
    price: 1000,
    actorId: '1',
    manufacturerId: 1,
    categoryId: 1,
    productColors: [<ProductColor>{
      name: 'Yellow'
    }, <ProductColor>{
      name: 'Red'
    }, <ProductColor>{
      name: 'Blue'
    }],
    productImages: [
      {
        imageName: 'intel.png',
        imageUrl: 'http://mock-image/'
      }
    ],
    description: 'CPU Product',
    stock: 1,
    discount: 10,
    location: 'New York',
    minPurchase: 1,
    hasExpiry: 'true',
    expireDate: '2018-06-05T07:00:00.000Z'
  },
  <ProductViewModel>{
    id: '2',
    name: 'Intel2',
    price: 1000,
    actorId: '1',
    manufacturerId: 1,
    categoryId: 1,
    productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
    productImages: [
      {
        imageName: 'intel.png',
        imageUrl: 'http://mock-image/'
      }
    ],
    description: 'CPU Product',
    stock: 1,
    discount: 10,
    location: 'New York',
    minPurchase: 1,
    hasExpiry: 'true',
    expireDate: '2018-06-05T07:00:00.000Z'
  },
  <ProductViewModel>{
    id: '3',
    name: 'Intel3',
    price: 1000,
    actorId: '1',
    manufacturerId: 1,
    categoryId: 1,
    productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
    productImages: [
      {
        imageName: 'intel.png',
        imageUrl: 'http://mock-image/'
      }
    ],
    description: 'CPU Product',
    stock: 1,
    discount: 10,
    location: 'New York',
    minPurchase: 1,
    hasExpiry: 'true',
    expireDate: '2018-06-05T07:00:00.000Z'
  },
  <ProductViewModel>{
    id: '4',
    name: 'Intel4',
    price: 1000,
    actorId: '1',
    manufacturerId: 1,
    categoryId: 1,
    productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
    productImages: [
      {
        imageName: 'intel.png',
        imageUrl: 'http://mock-image/'
      }
    ],
    description: 'CPU Product',
    stock: 1,
    discount: 10,
    location: 'New York',
    minPurchase: 1,
    hasExpiry: 'true',
    expireDate: '2018-06-05T07:00:00.000Z'
  },
  <ProductViewModel>{
    id: '5',
    name: 'Intel5',
    price: 1000,
    actorId: '1',
    manufacturerId: 1,
    categoryId: 1,
    productColors: [<ProductColor>{ name: 'Yellow' }, <ProductColor>{ name: 'Red' }, <ProductColor>{ name: 'Blue' }],
    productImages: [
      {
        imageName: 'intel.png',
        imageUrl: 'http://mock-image/'
      }
    ],
    description: 'CPU Product',
    stock: 1,
    discount: 10,
    location: 'New York',
    minPurchase: 1,
    hasExpiry: 'true',
    expireDate: '2018-06-05T07:00:00.000Z'
  },
]