exports.isDark = true;
exports.cssClass = "ace-ambiance";
exports.cssText = require("./ambiance-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
