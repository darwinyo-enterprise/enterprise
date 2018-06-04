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
        description: 'CPU Product'
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
        description: 'CPU Product'
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
        description: 'CPU Product'
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
        description: 'CPU Product'
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
        description: 'CPU Product'
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
    description: 'CPU Product'
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
    description: 'CPU Product'
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
    description: 'CPU Product'
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
    description: 'CPU Product'
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
    description: 'CPU Product'
  },
]