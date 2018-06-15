"use strict";var __decorate=this&&this.__decorate||function(e,o,r,t){var n,a=arguments.length,p=a<3?o:null===t?t=Object.getOwnPropertyDescriptor(o,r):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)p=Reflect.decorate(e,o,r,t);else for(var _=e.length-1;0<=_;_--)(n=e[_])&&(p=(a<3?n(p):3<a?n(o,r,p):n(o,r))||p);return 3<a&&p&&Object.defineProperty(o,r,p),p},__param=this&&this.__param||function(r,t){return function(e,o){t(e,o,r)}};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),common_1=require("@angular/common"),app_component_1=require("./app.component"),platform_browser_1=require("@angular/platform-browser"),nx_1=require("@nrwl/nx"),catalog_module_1=require("./catalog/catalog.module"),core_module_1=require("./core/core.module"),app_routing_module_1=require("./app-routing.module"),shared_1=require("@enterprise/shared"),AppModule=function(){function e(e,o){this.platformId=e,this.appId=o;var r=common_1.isPlatformBrowser(e)?"in the browser":"on the server";console.log("Running "+r+" with appId="+o)}return e=__decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule.withServerTransition({appId:"enterprise-commerce-admin-app"}),core_module_1.CoreModule,shared_1.SharedModule,catalog_module_1.CatalogModule,nx_1.NxModule.forRoot(),app_routing_module_1.AppRoutingModule],declarations:[app_component_1.AppComponent],bootstrap:[app_component_1.AppComponent]}),__param(0,core_1.Inject(core_1.PLATFORM_ID)),__param(1,core_1.Inject(core_1.APP_ID))],e)}();exports.AppModule=AppModule;