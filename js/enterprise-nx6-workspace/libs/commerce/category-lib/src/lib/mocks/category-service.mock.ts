import { Category, CategoryService, PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

export const CategoriesMock: Category[] = [
  <Category>{
    id: 1,
    name: 'CPU',
    description: 'CPU Category',
    imageName: 'Intel.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 2,
    name: 'Software',
    description: 'Software Company',
    imageName: 'Microsoft.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 3,
    name: 'PC',
    description: 'Software Company',
    imageName: 'Google.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 4,
    name: 'Laptop',
    description: 'Hardware Category',
    imageName: 'Apple.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 5,
    name: 'Tablet',
    description: 'CPU Category',
    imageName: 'AMD.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 6,
    name: 'TV',
    description: 'Software Company',
    imageName: 'Docker.png',
    imageUrl: 'http://mock-image/'
  },
  <Category>{
    id: 7,
    name: 'Console',
    description: 'Software Company',
    imageName: 'Facebook.png',
    imageUrl: 'http://mock-image/'
  }
];

export const PaginatedCategoriesMock: PaginatedListViewModelItemViewModel = <PaginatedListViewModelItemViewModel>
  {
    listData: [{
      "id": "e11cc306-21be-4ca1-a5e1-e89b13b5f22f",
      "name": "Emily Puckett"
    },
    {
      "id": "0b5a6986-8d9c-4b56-8a9a-f64c60da5b7a",
      "name": "Rachelle Miller"
    },
    {
      "id": "e6a0c3c7-bc1d-4593-9137-262391e2df72",
      "name": "Danielle Ellison"
    },
    {
      "id": "270150b6-d25e-4ec2-bc2c-414fb44b5fda",
      "name": "Mae Gay"
    },
    {
      "id": "9bfc5ef4-b788-4fab-af12-3376c1cf3a06",
      "name": "Lelia Ray"
    },
    {
      "id": "953bb631-1035-41c6-aa79-1dbdca4bac78",
      "name": "Mueller Osborn"
    },
    {
      "id": "71dcb50a-fe80-41eb-ab6c-565b6e136a79",
      "name": "Rosemarie Leach"
    },
    {
      "id": "d5954ba2-726d-4b83-84c0-322388cf2abd",
      "name": "Underwood Sharpe"
    },
    {
      "id": "79508c6b-34ee-4cef-b3d1-10c5f9942a0f",
      "name": "Porter Bowen"
    },
    {
      "id": "58cbb2a9-3cc6-44d7-88d6-8f208d2c0237",
      "name": "Shepherd Nash"
    }],
    pageIndex: 1,
    pageSize: 10,
    count: 500
  }