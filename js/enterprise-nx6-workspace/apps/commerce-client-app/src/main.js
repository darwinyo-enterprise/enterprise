"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),platform_browser_dynamic_1=require("@angular/platform-browser-dynamic"),app_module_1=require("./app/app.module"),environment_1=require("./environments/environment");environment_1.environment.production&&core_1.enableProdMode(),platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).catch(function(e){return console.log(e)});