"use strict";var __decorate=this&&this.__decorate||function(e,o,r,u){var t,c=arguments.length,a=c<3?o:null===u?u=Object.getOwnPropertyDescriptor(o,r):u;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,o,r,u);else for(var d=e.length-1;0<=d;d--)(t=e[d])&&(a=(c<3?t(a):3<c?t(o,r,a):t(o,r))||a);return 3<c&&a&&Object.defineProperty(o,r,a),a};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),common_1=require("@angular/common"),product_module_1=require("../product/product.module"),category_module_1=require("../category/category.module"),manufacturer_module_1=require("../manufacturer/manufacturer.module"),CatalogModule=function(){function e(){}return e=__decorate([core_1.NgModule({imports:[common_1.CommonModule,product_module_1.ProductModule,category_module_1.CategoryModule,manufacturer_module_1.ManufacturerModule],declarations:[],exports:[product_module_1.ProductModule,category_module_1.CategoryModule,manufacturer_module_1.ManufacturerModule]})],e)}();exports.CatalogModule=CatalogModule;