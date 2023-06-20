exports.isDark = true;
exports.cssClass = "ace-pastel-on-dark";
exports.cssText = require("./pastel_on_dark-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
