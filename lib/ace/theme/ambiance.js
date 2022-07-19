exports.isDark = true;
exports.cssClass = "ace-ambiance";
exports.cssText = require("../requirejs/text!./ambiance.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
