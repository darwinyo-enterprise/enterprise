import { IConfiguration } from "@enterprise/core";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  configuration: <IConfiguration>{
    identityUrl: 'http://localhost:5105',
    catalogUrl: 'http://localhost:5101',
    basketUrl: 'http://localhost:5103',
    orderUrl: 'http://localhost:5102',
    orderSignalR: 'http://localhost:5112'
  }
};
