exports.isDark = false;
exports.cssClass = "ace-katzenmilch";
exports.cssText = require("../requirejs/text!./katzenmilch.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
