"use strict";var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}}();Object.defineProperty(exports,"__esModule",{value:!0});var testing_1=require("@angular/core/testing"),star_component_1=require("./star.component"),testing_2=require("@enterprise/core/testing"),StarComponentPage=function(n){function t(t){var e=n.call(this,t)||this;return e.fixture=t,e}return __extends(t,n),Object.defineProperty(t.prototype,"starlit",{get:function(){return this.query(".card-item__detail__star-rate__lit")},enumerable:!0,configurable:!0}),t}(testing_2.BaseTestPage);exports.StarComponentPage=StarComponentPage,describe("StarComponent",function(){var t,e,n;beforeEach(testing_1.async(function(){testing_1.TestBed.configureTestingModule({declarations:[star_component_1.StarComponent]}).compileComponents()})),beforeEach(function(){e=testing_1.TestBed.createComponent(star_component_1.StarComponent),t=e.componentInstance,e.detectChanges(),n=new StarComponentPage(e)}),it("should render correct width star by starWidth Input",function(){t.starWidth=20,e.detectChanges(),expect(n.starlit.style.width).toContain("20%")})});