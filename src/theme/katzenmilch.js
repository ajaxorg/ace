exports.isDark = false;
exports.cssClass = "ace-katzenmilch";
exports.cssText = require("./katzenmilch-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
