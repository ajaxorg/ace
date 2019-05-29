exports.isDark = false;
exports.cssClass = "ace-xcode";
exports.cssText = require("./xcode.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
