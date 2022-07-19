exports.isDark = false;
exports.cssClass = "ace-dreamweaver";
exports.cssText = require("../requirejs/text!./dreamweaver.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
