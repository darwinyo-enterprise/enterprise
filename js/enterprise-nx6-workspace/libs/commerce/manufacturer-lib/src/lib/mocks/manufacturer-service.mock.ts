import { Manufacturer, ManufacturerService, PaginatedListViewModelItemViewModel } from '@enterprise/commerce/catalog-lib';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

export const ManufacturersMock: Manufacturer[] = [
  <Manufacturer>{
    id: 1,
    name: 'Intel',
    description: 'CPU Manufacturer',
    imageName: 'Intel.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 2,
    name: 'Microsoft',
    description: 'Software Company',
    imageName: 'Microsoft.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 3,
    name: 'Google',
    description: 'Software Company',
    imageName: 'Google.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 4,
    name: 'Apple',
    description: 'Hardware Manufacturer',
    imageName: 'Apple.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 5,
    name: 'AMD',
    description: 'CPU Manufacturer',
    imageName: 'AMD.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 6,
    name: 'Docker',
    description: 'Software Company',
    imageName: 'Docker.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 7,
    name: 'Facebook',
    description: 'Software Company',
    imageName: 'Facebook.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 8,
    name: 'Samsung',
    description: 'Hardware Manufacturer',
    imageName: 'Samsung.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 9,
    name: 'Asus',
    description: 'Device Manufacturer',
    imageName: 'Asus.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 10,
    name: 'Dell',
    description: 'PC Manufacturer',
    imageName: 'Dell.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 11,
    name: 'Enterprise',
    description: 'Software Company',
    imageName: 'Enterprise.png',
    imageUrl: 'http://mock-image/'
  },
  <Manufacturer>{
    id: 12,
    name: 'Adobe',
    description: 'Software Manufacturer',
    imageName: 'Adobe.png',
    imageUrl: 'http://mock-image/'
  }
];

export const PaginatedManufacturersMock: PaginatedListViewModelItemViewModel = <PaginatedListViewModelItemViewModel>
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