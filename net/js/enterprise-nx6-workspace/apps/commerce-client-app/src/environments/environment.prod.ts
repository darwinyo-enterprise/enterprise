import { IConfiguration } from "@enterprise/core/src";

export const environment = {
  production: true,
  configuration: <IConfiguration>{
    identityUrl: process.env.identityUrl,
    signalrUrl: process.env.signalrUrl
  }
};
