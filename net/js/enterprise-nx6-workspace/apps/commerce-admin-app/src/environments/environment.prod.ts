import { IConfiguration } from "@enterprise/core/src";

export const environment = {
  production: true,
  configuration: <IConfiguration>{
    identityUrl: 'http://localhost:5105',
    catalogUrl: 'http://localhost:5101',
    basketUrl: 'http://localhost:5103',
    orderUrl: 'http://localhost:5102',
    orderSignalR: 'http://localhost:5112'
  }
};
