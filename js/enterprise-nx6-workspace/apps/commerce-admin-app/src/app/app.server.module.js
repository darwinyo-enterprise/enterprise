"use strict";var __decorate=this&&this.__decorate||function(e,r,o,t){var p,a=arguments.length,l=a<3?r:null===t?t=Object.getOwnPropertyDescriptor(r,o):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,r,o,t);else for(var u=e.length-1;0<=u;u--)(p=e[u])&&(l=(a<3?p(l):3<a?p(r,o,l):p(r,o))||l);return 3<a&&l&&Object.defineProperty(r,o,l),l};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),platform_server_1=require("@angular/platform-server"),module_map_ngfactory_loader_1=require("@nguniversal/module-map-ngfactory-loader"),app_module_1=require("./app.module"),app_component_1=require("./app.component"),AppServerModule=function(){function e(){}return e=__decorate([core_1.NgModule({imports:[app_module_1.AppModule,platform_server_1.ServerModule,module_map_ngfactory_loader_1.ModuleMapLoaderModule],providers:[],bootstrap:[app_component_1.AppComponent]})],e)}();exports.AppServerModule=AppServerModule;