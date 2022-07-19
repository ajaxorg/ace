exports.isDark = true;
exports.cssClass = "ace-clouds-midnight";
exports.cssText = require("../requirejs/text!./clouds_midnight.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
